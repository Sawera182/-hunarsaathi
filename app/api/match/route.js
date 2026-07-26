import { NextResponse } from "next/server";
import { CATEGORIES } from "../../../lib/categories";

// ---- THIS IS THE AI FEATURE'S SYSTEM PROMPT (written for this project) ----
const SYSTEM_INSTRUCTIONS = `You are the matching assistant for HunarSaathi, a platform in Pakistan
that connects people with local service professionals (plumbers, electricians,
maids, movers, carpenters, painters, AC technicians, cooks, gardeners, drivers).

A user will describe, in their own words, a problem or task they need help with.
Your job:
1. Pick exactly ONE category from this fixed list that best matches their need:
   ${CATEGORIES.join(", ")}
2. Judge the urgency as one of: "Low", "Medium", "High".
   - High = safety risk, active damage, or time-critical (e.g. active leak,
     no electricity, burst pipe, move happening today/tomorrow).
   - Medium = needs attention soon but not an emergency.
   - Low = general or scheduled task with no time pressure.
3. Estimate a realistic number of hours a skilled professional would need to
   complete this specific task (a whole number, be realistic, e.g. 1-6 for
   most home tasks, more for large moves).
4. Write a short, clear "job brief" (1-3 sentences) rephrasing what the user
   described into a professional, actionable request a worker could read and
   immediately understand what to do. Keep the user's key details (what's
   broken, what's needed, any timing they mentioned).

Respond ONLY with valid JSON, no markdown fences, no extra commentary,
matching exactly this shape:

{
  "category": "string (must be exactly one of the allowed categories)",
  "urgency": "Low" | "Medium" | "High",
  "estimatedHours": number,
  "brief": "string"
}`;

export async function POST(request) {
  try {
    const { problem } = await request.json();

    if (!problem || !problem.trim()) {
      return NextResponse.json(
        { error: "Please describe your problem first." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Server is missing GEMINI_API_KEY. Add it in your hosting provider's environment variables.",
        },
        { status: 500 }
      );
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTIONS }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: `User's problem: ${problem}` }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "AI provider error. Please try again in a moment." },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse AI response:", rawText);
      return NextResponse.json(
        { error: "AI returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    if (!CATEGORIES.includes(parsed.category)) {
      parsed.category = CATEGORIES[0];
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

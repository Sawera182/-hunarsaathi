# 🛠 HunarSaathi — Hire Trusted Local Professionals by the Hour

**HunarSaathi** ("skill companion" in Urdu) is a two-sided marketplace that connects
people who need help around the house — plumbing, cleaning, moving, electrical work,
cooking, and more — with local skilled professionals who register on the platform
and get hired by the hour.

## a. What it does & the real problem it solves

**The problem:** Finding a trustworthy plumber, electrician, maid, or mover on short
notice is genuinely hard, especially in cities where there's no organized local
directory for these services. People fall back on word-of-mouth or random contacts
saved on someone's phone. On the other side, skilled workers (plumbers, maids,
carpenters, drivers, etc.) have no easy digital way to advertise their availability
and get hired.

**Who it's for:** Households and individuals who need a specific service done
(e.g. someone shifting house, a burst pipe, a one-time deep clean), and local
professionals who want a simple way to be found and booked.

**What the app does:**
- Lets a customer describe their problem in plain language and uses AI to figure out
  exactly which professional category they need, how urgent it is, and turns their
  message into a clear job brief.
- Lets customers browse and filter registered professionals by category and city.
- Lets professionals register themselves with their skill, hourly rate, city,
  experience, and a short bio.
- Lets customers send a real booking request (date, hours needed, address, notes)
  to a specific professional, with an instant estimated cost.

## b. Live URL

 🔗 **[hunarsaathi-xi.vercel.app](https://hunarsaathi-xi.vercel.app)


## c. Features list

- 🤖 **AI Problem Matcher** — describe your issue in your own words, get the right
  category, urgency level, estimated hours, and a clean job brief.
- 🔍 **Browse & filter professionals** by category and city.
- 📝 **Professional registration** — name, phone, category, city, hourly rate,
  years of experience, bio.
- 📅 **Booking flow** — pick a date, hours needed, address, and notes; get an
  instant estimated cost (hourly rate × hours).
- ✅ **Booking confirmation screen** with estimated total cost.
- 📱 Fully responsive, clean UI usable on mobile.
- 🔒 No API keys or secrets committed to the repo — all in environment variables.

## d. The AI feature

**What it does:** On the homepage, a user types a free-text description of their
problem (e.g. *"my kitchen sink is leaking badly and water is spreading on the
floor"*). This is sent to Google's Gemini model, which returns:
- the correct professional **category** to hire (from a fixed list used across the app),
- an **urgency** level (Low / Medium / High),
- an **estimated hours** needed for the job,
- a rewritten, clear **job brief** that gets carried through to the booking form.

This directly solves the "I don't know exactly who to hire" problem — it's the
translation layer between a messy real-world problem and the right professional.

**The exact system prompt used** (in `app/api/match/route.js`):

```
You are the matching assistant for HunarSaathi, a platform in Pakistan
that connects people with local service professionals (plumbers, electricians,
maids, movers, carpenters, painters, AC technicians, cooks, gardeners, drivers).

A user will describe, in their own words, a problem or task they need help with.
Your job:
1. Pick exactly ONE category from this fixed list that best matches their need:
   Plumber, Electrician, Maid / Cleaner, House Shifting / Mover, Carpenter,
   Painter, AC Technician, Cook, Gardener, Driver
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
}
```

**Model used:** `gemini-1.5-flash` via the Google Generative Language API
(free tier).

## e. Tools, services, and AI models used

- **Framework:** Next.js 14 (App Router, React 18)
- **Hosting/deployment:** Vercel
- **Database:** Supabase (Postgres, free tier) — stores professionals and bookings
- **AI model:** Google Gemini (`gemini-1.5-flash`) via the Generative Language API
- **Language:** JavaScript
- **Version control:** Git + GitHub
- No paid services were used — every tool here has a free tier.

## f. Screenshots

> Replace these placeholders with real screenshots (drag image files into this
> section on GitHub, or add them to a `/screenshots` folder and link them).

<img width="1252" height="593" alt="homepage" src="https://github.com/user-attachments/assets/6c34508e-6408-46ca-b903-4730e9784192" />
<img width="1097" height="584" alt="2 screen" src="https://github.com/user-attachments/assets/13843b2a-bc4e-461d-a9cf-fe86c5ff9640" />
<img width="1093" height="623" alt="image" src="https://github.com/user-attachments/assets/d427be7c-b406-4e39-8cfe-fd1184b9d541" />
<img width="1209" height="628" alt="3" src="https://github.com/user-attachments/assets/f3fc4a55-f61a-4266-81a9-36fdaa48e043" />

<img width="1147" height="451" alt="Screenshot 2026-07-26 192323" src="https://github.com/user-attachments/assets/bc06509e-648e-4e62-bbd5-e3759448d0a8" />


## g. How to run this project

### Option 1 — Just use the live app
Open the live URL above. No setup needed.

### Option 2 — Run it locally

**Requirements:** Node.js 18+, a free [Supabase](https://supabase.com) account,
and a free [Google AI Studio](https://aistudio.google.com/app/apikey) API key.

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hunarsaathi.git
   cd hunarsaathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a free project at [supabase.com](https://supabase.com)
   - Open the SQL Editor and run everything in `supabase_schema.sql`
     (creates the `professionals` and `bookings` tables + public access policies)
   - Copy your Project URL and anon public key from
     Project Settings → API

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Deploying it yourself (Vercel)
1. Push this repo to your own public GitHub account.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. Add the same three environment variables from `.env.local` in
   Vercel's "Environment Variables" settings.
4. Click Deploy.

## Known limitations (honest notes)

- There's no login/authentication system — this is a class project scoped to
  demonstrate the core marketplace + AI matching flow within a one-day deadline.
  Anyone can register as a professional or submit a booking, and Supabase's
  public policies allow open read/insert access (no update/delete exposed).
- Payments are not integrated — bookings are requests; payment happens directly
  between customer and professional, similar to how many local service
  marketplaces start out.
- No SMS/email notifications yet — the professional would need to check the
  bookings table or be contacted directly via the phone number provided.

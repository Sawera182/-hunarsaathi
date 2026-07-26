"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "../lib/categories";

export default function Home() {
  const router = useRouter();
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    setError("");
    setResult(null);

    if (!problem.trim()) {
      setError("Describe what you need help with first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function goToProfessionals(category, brief) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brief) params.set("brief", brief);
    router.push(`/professionals?${params.toString()}`);
  }

  return (
    <div>
      <div className="hero">
        <h1>Find and book the right local professional — fast.</h1>
        <p>
          Plumbers, electricians, maids, movers, and more — registered, ready,
          and paid by the hour. Not sure who you need? Just describe your
          problem below.
        </p>
      </div>

      <div className="card">
        <h2>🤖 Describe your problem, let AI figure out who you need</h2>
        <div className="field">
          <textarea
            rows={3}
            placeholder='e.g. "My kitchen sink is leaking badly and water is spreading on the floor" or "I am shifting to a new house this weekend and need help moving furniture"'
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>
        <button className="btn" onClick={handleAnalyze} disabled={loading}>
          {loading && <span className="spinner"></span>}
          {loading ? "Analyzing..." : "Find who I need"}
        </button>

        {error && (
          <div className="error" style={{ marginTop: "14px" }}>
            {error}
          </div>
        )}

        {result && (
          <div className="ai-result">
            <h4>Here's what you probably need</h4>
            <p style={{ margin: "0 0 8px" }}>
              <span className="badge">{result.category}</span>
              <span
                className={`badge ${
                  result.urgency === "High" ? "urgent" : ""
                }`}
              >
                Urgency: {result.urgency}
              </span>
              <span className="badge" style={{ background: "#4b5a52" }}>
                ~{result.estimatedHours} hrs
              </span>
            </p>
            <p style={{ margin: "0 0 12px", color: "#33413a" }}>
              {result.brief}
            </p>
            <button
              className="btn"
              onClick={() => goToProfessionals(result.category, result.brief)}
            >
              Browse {result.category}s near me
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Or browse by category</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="category-chip"
              onClick={() => goToProfessionals(cat, "")}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-note">
        Are you a plumber, electrician, maid, or other skilled worker?{" "}
        <a href="/register" style={{ textDecoration: "underline" }}>
          Register here
        </a>{" "}
        and start getting hired.
      </div>
    </div>
  );
}

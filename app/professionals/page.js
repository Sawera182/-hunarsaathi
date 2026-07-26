"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { CATEGORIES } from "../../lib/categories";

function ProfessionalsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState("");
  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const brief = searchParams.get("brief") || "";

  useEffect(() => {
    fetchPros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, city]);

  async function fetchPros() {
    setLoading(true);
    setError("");
    try {
      let query = supabase
        .from("professionals")
        .select("*")
        .order("created_at", { ascending: false });

      if (category) query = query.eq("category", category);
      if (city.trim()) query = query.ilike("city", `%${city.trim()}%`);

      const { data, error: err } = await query;
      if (err) throw err;
      setPros(data || []);
    } catch (e) {
      setError(
        "Couldn't load professionals. Make sure Supabase is set up correctly."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function goBook(id) {
    const params = new URLSearchParams();
    if (brief) params.set("brief", brief);
    router.push(`/book/${id}?${params.toString()}`);
  }

  return (
    <div>
      <div className="hero">
        <h1>Find Help</h1>
        <p>Browse registered professionals by category and city.</p>
      </div>

      {brief && (
        <div className="ai-result" style={{ marginBottom: "20px" }}>
          <h4>Your job brief (from the AI matcher)</h4>
          <p style={{ margin: 0 }}>{brief}</p>
        </div>
      )}

      <div className="card">
        <div className="filters">
          <div className="field" style={{ minWidth: "200px" }}>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ minWidth: "200px" }}>
            <label>City / area</label>
            <input
              type="text"
              placeholder="e.g. Quetta"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="empty-state">Loading professionals...</div>}

      {!loading && pros.length === 0 && !error && (
        <div className="empty-state">
          No professionals found yet for this filter.{" "}
          <a href="/register" style={{ textDecoration: "underline" }}>
            Be the first to register.
          </a>
        </div>
      )}

      {!loading &&
        pros.map((p) => (
          <div className="pro-card" key={p.id}>
            <div className="pro-info">
              <h3>{p.name}</h3>
              <div className="pro-meta">
                {p.category} • {p.city} • {p.experience_years} yrs experience
              </div>
              <div className="pro-bio">{p.bio}</div>
            </div>
            <div className="pro-actions">
              <span className="rate-badge">PKR {p.hourly_rate}/hr</span>
              <button className="btn" onClick={() => goBook(p.id)}>
                Book Now
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<div className="empty-state">Loading...</div>}>
      <ProfessionalsInner />
    </Suspense>
  );
}

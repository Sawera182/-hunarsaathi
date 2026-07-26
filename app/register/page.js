"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { CATEGORIES } from "../../lib/categories";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: CATEGORIES[0],
    city: "",
    hourly_rate: "",
    experience_years: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      setError("Name, phone, and city are required.");
      return;
    }
    if (!form.hourly_rate || Number(form.hourly_rate) <= 0) {
      setError("Enter a valid hourly rate.");
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.from("professionals").insert([
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
          category: form.category,
          city: form.city.trim(),
          hourly_rate: Number(form.hourly_rate),
          experience_years: Number(form.experience_years) || 0,
          bio: form.bio.trim(),
        },
      ]);
      if (err) throw err;

      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        category: CATEGORIES[0],
        city: "",
        hourly_rate: "",
        experience_years: "",
        bio: "",
      });
    } catch (e) {
      console.error(e);
      setError(
        "Couldn't save your registration. Make sure Supabase is set up correctly."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="hero">
        <h1>Register as a Professional</h1>
        <p>
          List your skill, your rate, and your city — customers looking for
          exactly what you do will find you.
        </p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label>Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Phone number</label>
            <input
              type="tel"
              placeholder="03xx-xxxxxxx"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Profession / category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>City / area</label>
            <input
              type="text"
              placeholder="e.g. Quetta"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Hourly rate (PKR)</label>
            <input
              type="number"
              min="0"
              value={form.hourly_rate}
              onChange={(e) => update("hourly_rate", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Years of experience</label>
            <input
              type="number"
              min="0"
              value={form.experience_years}
              onChange={(e) => update("experience_years", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>Short bio (what you're good at)</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="e.g. 8 years fixing home plumbing issues, available same-day for emergencies."
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && (
          <div className="success">
            You're registered! Customers can now find and book you under{" "}
            <strong>{form.category || "your category"}</strong>.
          </div>
        )}

        <button className="btn" type="submit" disabled={loading}>
          {loading && <span className="spinner"></span>}
          {loading ? "Saving..." : "Register"}
        </button>
      </form>
    </div>
  );
}

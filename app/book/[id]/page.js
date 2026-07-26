"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

function BookInner() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const briefFromAI = searchParams.get("brief") || "";

  const [pro, setPro] = useState(null);
  const [loadingPro, setLoadingPro] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    date: "",
    hours_needed: "",
    address: "",
    notes: briefFromAI,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchPro() {
    setLoadingPro(true);
    try {
      const { data, error: err } = await supabase
        .from("professionals")
        .select("*")
        .eq("id", id)
        .single();
      if (err || !data) {
        setNotFound(true);
      } else {
        setPro(data);
      }
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoadingPro(false);
    }
  }

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.customer_name.trim() ||
      !form.customer_phone.trim() ||
      !form.date ||
      !form.hours_needed ||
      !form.address.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: err } = await supabase.from("bookings").insert([
        {
          professional_id: id,
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.trim(),
          date: form.date,
          hours_needed: Number(form.hours_needed),
          address: form.address.trim(),
          notes: form.notes.trim(),
          status: "pending",
        },
      ]);
      if (err) throw err;
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setError("Couldn't submit your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPro) return <div className="empty-state">Loading...</div>;
  if (notFound)
    return <div className="empty-state">Professional not found.</div>;

  if (success) {
    return (
      <div className="card">
        <h2>Booking request sent! 🎉</h2>
        <p>
          Your request has been sent to <strong>{pro.name}</strong>. They'll
          contact you on <strong>{form.customer_phone}</strong> to confirm.
        </p>
        <p style={{ color: "#5a6b62", fontSize: "0.9rem" }}>
          Estimated cost: PKR {pro.hourly_rate} × {form.hours_needed} hrs ≈{" "}
          <strong>PKR {pro.hourly_rate * Number(form.hours_needed)}</strong>
        </p>
        <a className="btn" href="/professionals">
          Back to browsing
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Booking: {pro.name}</h2>
        <div className="pro-meta">
          {pro.category} • {pro.city} • PKR {pro.hourly_rate}/hr •{" "}
          {pro.experience_years} yrs experience
        </div>
        <p className="pro-bio">{pro.bio}</p>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Your details</h2>
        <div className="row">
          <div className="field">
            <label>Your name</label>
            <input
              type="text"
              value={form.customer_name}
              onChange={(e) => update("customer_name", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Your phone number</label>
            <input
              type="tel"
              value={form.customer_phone}
              onChange={(e) => update("customer_phone", e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Date needed</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Hours needed</label>
            <input
              type="number"
              min="1"
              value={form.hours_needed}
              onChange={(e) => update("hours_needed", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>Address</label>
          <input
            type="text"
            placeholder="House/street, area, city"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>

        <div className="field">
          <label>Notes for the professional</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting && <span className="spinner"></span>}
          {submitting ? "Sending..." : "Confirm Booking Request"}
        </button>
      </form>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="empty-state">Loading...</div>}>
      <BookInner />
    </Suspense>
  );
}

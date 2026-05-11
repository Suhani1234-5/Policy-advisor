import React, { useState } from "react";

export default function ProfileForm({ onSubmit, loading }) {
  const [f, setF] = useState({
    name: "",
    age: "",
    lifestyle: "",
    conditions: [],
    income_band: "",
    city_tier: "",
  });

  const toggle = (c) =>
    setF((p) => ({
      ...p,
      conditions: p.conditions.includes(c)
        ? p.conditions.filter((x) => x !== c)
        : c === "None"
        ? ["None"]
        : [...p.conditions.filter((x) => x !== "None"), c],
    }));

  const submit = (e) => {
    e.preventDefault();
    if (
      !f.name ||
      !f.age ||
      !f.lifestyle ||
      !f.income_band ||
      !f.city_tier ||
      !f.conditions.length
    ) {
      alert("Please fill all 6 fields");
      return;
    }
    onSubmit({ ...f, age: parseInt(f.age) });
  };

  return (
    <form className="profile-form" onSubmit={submit}>
      <div className="form-header">
        <span className="form-badge">Your Profile — 6 Fields</span>
        <h2>Tell us about yourself</h2>
        <p>
          Every detail shapes your recommendation — not just the cheapest plan,
          but the right one.
        </p>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>Full Name</label>
          <input
            placeholder="Priya Sharma"
            value={f.name}
            onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Age</label>
          <input
            type="number"
            placeholder="32"
            min="1"
            max="99"
            value={f.age}
            onChange={(e) => setF((p) => ({ ...p, age: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Lifestyle</label>
          <select
            value={f.lifestyle}
            onChange={(e) => setF((p) => ({ ...p, lifestyle: e.target.value }))}
          >
            <option value="">Select lifestyle</option>
            {["Sedentary", "Moderate", "Active", "Athlete"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Annual Income</label>
          <select
            value={f.income_band}
            onChange={(e) => setF((p) => ({ ...p, income_band: e.target.value }))}
          >
            <option value="">Select income</option>
            {["under 3L", "3-8L", "8-15L", "15L+"].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>City Tier</label>
          <select
            value={f.city_tier}
            onChange={(e) => setF((p) => ({ ...p, city_tier: e.target.value }))}
          >
            <option value="">Select city tier</option>
            {["Metro", "Tier-2", "Tier-3"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field conditions-field">
        <label>
          Pre-existing Conditions <span className="label-hint">Select all that apply</span>
        </label>
        <div className="condition-chips">
          {["Diabetes", "Hypertension", "Asthma", "Cardiac", "None", "Other"].map(
            (c) => (
              <button
                key={c}
                type="button"
                className={`chip ${f.conditions.includes(c) ? "chip-active" : ""}`}
                onClick={() => toggle(c)}
              >
                {c}
              </button>
            )
          )}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading && <span className="spinner" />}
        {loading ? "Finding your best plan..." : "Get My Recommendation →"}
      </button>
    </form>
  );
}

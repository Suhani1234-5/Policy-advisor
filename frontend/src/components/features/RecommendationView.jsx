import React from "react";
import Markdown from "../shared/Markdown";

export default function RecommendationView({ data, profile }) {
  if (!profile) return null;

  return (
    <div className="recommendation">
      <div className="rec-header">
        <div className="rec-badge">✦ Best fit found</div>
        <h2>Your recommendation, {profile.name}</h2>
        <p className="rec-sub">
          Age {profile.age} · {profile.city_tier} · {profile.income_band} income ·{" "}
          {profile.conditions.join(", ")}
        </p>
      </div>
      <div className="rec-body">
        <Markdown text={data} />
      </div>
    </div>
  );
}

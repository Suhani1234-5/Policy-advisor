import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/features/ProfileForm";
import { apiService } from "../services/api";

export default function GetStarted({ setProfile, setRec, setSessionId }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (profileData) => {
    setLoading(true);
    setErr("");
    const sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    setSessionId(sid);
    
    try {
      const d = await apiService.getRecommendation(sid, profileData);
      setProfile(profileData);
      setRec(d.recommendation);
      navigate("/result");
    } catch (error) {
      setErr("Could not connect to backend. Make sure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="get-started-page">
      <div className="hero">
        <div className="hero-pill">Step 1 of 2</div>
        <h1>Tell us about yourself</h1>
        <p>This information helps our AI analyze policy documents to find your perfect match.</p>
      </div>

      {err && <div className="error-banner">{err}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="loading-orb" />
          <h3>Analysing your profile...</h3>
          <p>Retrieving policy documents and building your recommendation.</p>
          <div className="loading-steps">
            {[
              "Reading your health profile",
              "Searching policy knowledge base",
              "Generating personalised recommendation",
            ].map((s, i) => (
              <div
                key={i}
                className="loading-step"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <span className="step-dot" />
                {s}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ProfileForm onSubmit={handleSubmit} loading={loading} />
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        .get-started-page {
          padding-top: 40px;
        }
      `}} />
    </div>
  );
}

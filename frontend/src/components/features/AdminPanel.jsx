import React, { useState } from "react";
import { apiService } from "../../services/api";

export default function AdminPanel({ onClose }) {
  const [creds, setCreds] = useState({ u: "admin", p: "" });
  const [authed, setAuthed] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [form, setForm] = useState({ name: "", insurer: "", file: null });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const auth = "Basic " + btoa(`${creds.u}:${creds.p}`);

  const login = async () => {
    try {
      const d = await apiService.getPolicies(auth);
      setAuthed(true);
      setPolicies(d.policies);
    } catch (error) {
      setMsg("❌ " + error.message);
    }
  };

  const upload = async () => {
    if (!form.file || !form.name || !form.insurer) {
      setMsg("Fill all fields");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", form.file);
    fd.append("policy_name", form.name);
    fd.append("insurer", form.insurer);
    try {
      const d = await apiService.uploadPolicy(auth, fd);
      setMsg(d.message);
      setPolicies((p) => [...p, form.name]);
      setForm({ name: "", insurer: "", file: null });
    } catch (error) {
      setMsg("❌ " + error.message);
    }
    setUploading(false);
  };

  const del = async (name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await apiService.deletePolicy(auth, name);
      setPolicies((p) => p.filter((x) => x !== name));
      setMsg(`Deleted: ${name}`);
    } catch (error) {
      setMsg("❌ " + error.message);
    }
  };

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <h3>Admin Panel</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {!authed ? (
          <div className="admin-login">
            <p>Manage the policy knowledge base. Sign in to continue.</p>
            <input
              placeholder="Username"
              value={creds.u}
              onChange={(e) => setCreds((c) => ({ ...c, u: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              value={creds.p}
              onChange={(e) => setCreds((c) => ({ ...c, p: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            <button className="btn-primary" onClick={login}>
              Sign In
            </button>
            {msg && <div className="admin-msg">{msg}</div>}
          </div>
        ) : (
          <div className="admin-body">
            <div className="admin-section">
              <h4>Upload Policy Document</h4>
              <input
                placeholder="Policy name (e.g. Family Health Optima)"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...p, name: e.target.value }))}
              />
              <input
                placeholder="Insurer (e.g. Star Health)"
                value={form.insurer}
                onChange={(e) => setForm((f) => ({ ...p, insurer: e.target.value }))}
              />
              <input
                type="file"
                accept=".pdf,.txt,.json"
                onChange={(e) =>
                  setForm((f) => ({ ...f, file: e.target.files[0] }))
                }
              />
              <button
                className="btn-primary"
                onClick={upload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload & Index"}
              </button>
            </div>

            <div className="admin-section">
              <h4>Indexed Policies ({policies.length})</h4>
              {policies.length === 0 ? (
                <p className="empty-msg">No policies indexed yet.</p>
              ) : (
                policies.map((p) => (
                  <div key={p} className="policy-row">
                    <span>{p}</span>
                    <button className="delete-btn" onClick={() => del(p)}>
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
            {msg && <div className="admin-msg">{msg}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminPanel from "../features/AdminPanel";

export default function Navbar() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <>
      <header className="app-header">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="logo-mark">✦</span>
          <span className="logo-text">AarogyaID</span>
          <span className="logo-tagline">Policy Advisor</span>
        </Link>
        <button className="admin-link" onClick={() => setAdminOpen(true)}>
          Admin ↗
        </button>
      </header>
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </>
  );
}

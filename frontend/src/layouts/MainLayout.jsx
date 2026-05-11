import React from "react";
import Navbar from "../components/shared/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

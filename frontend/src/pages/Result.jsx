import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import RecommendationView from "../components/features/RecommendationView";
import Chat from "../components/features/Chat";

export default function Result({ rec, profile, sessionId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!rec || !profile) {
      navigate("/get-started");
    }
  }, [rec, profile, navigate]);

  const handleDownload = () => {
    window.print();
  };

  if (!rec || !profile) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="result-page-container"
    >
      <div className="result-header-actions no-print">
        <button className="btn-back" onClick={() => navigate("/get-started")}>
          <ArrowLeft size={18} /> Modify Profile
        </button>
        <div className="action-group">
          <button className="btn-secondary-outline" onClick={handleDownload}>
            <Download size={16} /> Save PDF
          </button>
        </div>
      </div>

      <div className="result-grid-layout">
        <div className="result-content-area">
          <RecommendationView data={rec} profile={profile} />
        </div>
        
        <aside className="result-sidebar-area">
          <div className="sticky-sidebar">
            <Chat sessionId={sessionId} />
            <div className="sidebar-info-card">
              <h4>Need help?</h4>
              <p>Our advisors are available 24/7 to help you understand your policy better.</p>
              <button className="btn-text">Talk to an expert →</button>
            </div>
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .result-page-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding-top: 24px;
          animation: fadeIn 0.6s ease-out;
          overflow-x: hidden;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .result-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding: 0 4px;
        }
        .btn-back {
          background: var(--white);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--ink-soft);
          font-family: 'Sora', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-back:hover {
          border-color: var(--teal);
          color: var(--teal);
          box-shadow: 0 2px 8px rgba(14, 124, 107, 0.1);
        }
        .action-group {
          display: flex;
          gap: 12px;
        }
        .btn-secondary-outline {
          background: var(--white);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--ink-soft);
        }
        .btn-secondary-outline:hover {
          border-color: var(--teal);
          color: var(--teal);
        }
        .result-grid-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 32px;
          align-items: start;
          width: 100%;
        }
        .result-content-area {
          min-width: 0; /* Critical for preventing grid item overflow */
        }
        .sticky-sidebar {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }
        .sidebar-info-card {
          background: linear-gradient(135deg, var(--teal-light) 0%, #f0fdfa 100%);
          padding: 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .sidebar-info-card h4 {
          font-size: 15px;
          color: var(--teal);
          margin-bottom: 10px;
          font-family: 'DM Serif Display', serif;
        }
        .sidebar-info-card p {
          font-size: 13px;
          color: var(--ink-soft);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .btn-text {
          background: var(--teal);
          border: none;
          color: var(--white);
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .btn-text:hover {
          background: var(--teal-mid);
        }
        @media (max-width: 1100px) {
          .result-grid-layout {
            grid-template-columns: 1fr;
          }
          .sticky-sidebar {
            position: static;
          }
        @media print {
          .no-print, .result-sidebar-area, .app-header {
            display: none !important;
          }
          .result-page-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .result-grid-layout {
            grid-template-columns: 1fr !important;
          }
          body {
            background: white !important;
          }
          .main-content {
            padding: 0 !important;
          }
        }
      `}} />
    </motion.div>
  );
}

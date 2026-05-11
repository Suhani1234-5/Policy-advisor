import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, Heart, CheckCircle, ArrowRight, Activity, FileText, MessageSquare } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-content"
        >
          <div className="hero-pill-modern">
            <span className="pulse-dot"></span>
            AI-powered Policy Intelligence
          </div>
          <h1 className="hero-title">
            Health insurance that <br />
            <span>speaks your language.</span>
          </h1>
          <p className="hero-description">
            AarogyaID uses advanced RAG technology to analyze thousands of policy clauses, 
            matching them to your specific health profile and lifestyle.
          </p>
          <div className="hero-actions">
            <Link to="/get-started" className="btn-primary-lg">
              Get Personalized Recommendation <ArrowRight size={20} />
            </Link>
            <div className="hero-stats">
              <div className="stat-item">
                <strong>50+</strong>
                <span>Top Insurers Analyzed</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>100%</strong>
                <span>RAG Grounded Results</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="features-grid"
      >
        {[
          { 
            icon: <Shield />, 
            title: "Data-Driven Precision", 
            desc: "Our AI doesn't just guess. It reads actual policy documents to find hidden exclusions and benefits." 
          },
          { 
            icon: <Activity />, 
            title: "Personalized Analysis", 
            desc: "We factor in your city's healthcare costs, your lifestyle, and medical history for a true fit." 
          },
          { 
            icon: <MessageSquare />, 
            title: "Policy Explainer", 
            desc: "Confused by jargon? Our AI assistant explains every part of your policy in simple terms." 
          }
        ].map((item, i) => (
          <motion.div key={i} variants={itemVariants} className="feature-card-modern">
            <div className="feature-icon-box">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* How it Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How it works</h2>
          <p>Find the right coverage in three simple steps.</p>
        </div>
        <div className="steps-container">
          {[
            { step: "01", title: "Create Profile", desc: "Share your health details and requirements with us securely.", icon: <Activity size={24} /> },
            { step: "02", title: "AI Analysis", desc: "Our RAG engine scans hundreds of policies to find the best match.", icon: <FileText size={24} /> },
            { step: "03", title: "Get Clarity", desc: "Receive a personalized recommendation and chat to understand it.", icon: <CheckCircle size={24} /> }
          ].map((item, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{item.step}</div>
              <div className="step-icon">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-footer">
        <p>Built with trust in mind. Your data is encrypted and never shared with third parties.</p>
        <div className="trust-badges">
          <span>✓ HIPAA Compliant</span>
          <span>✓ SOC2 Type II</span>
          <span>✓ SSL Encrypted</span>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .home-page {
          padding-top: 0;
          overflow-x: hidden;
        }
        
        /* Hero Section */
        .hero-section {
          padding: 60px 24px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: radial-gradient(circle at 50% -20%, var(--teal-light) 0%, transparent 70%);
        }
        .hero-content {
          max-width: 900px;
          text-align: center;
        }
        .hero-pill-modern {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--white);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: var(--teal);
          margin-bottom: 32px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: var(--teal);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14, 124, 107, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(14, 124, 107, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(14, 124, 107, 0); }
        }
        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(40px, 8vw, 72px);
          line-height: 1.05;
          margin-bottom: 24px;
          color: var(--ink);
        }
        .hero-title span {
          color: var(--teal);
          font-style: italic;
        }
        .hero-description {
          font-size: 19px;
          color: var(--ink-muted);
          max-width: 650px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }
        .btn-primary-lg {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--teal);
          color: var(--white);
          padding: 18px 36px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 25px rgba(14, 124, 107, 0.25);
        }
        .btn-primary-lg:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(14, 124, 107, 0.3);
          background: var(--teal-mid);
        }
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          margin-top: 48px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-item strong {
          font-size: 24px;
          color: var(--ink);
          font-family: 'DM Serif Display', serif;
        }
        .stat-item span {
          font-size: 12px;
          color: var(--ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-divider {
          width: 1px;
          height: 30px;
          background: var(--border);
        }

        /* Features */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding: 60px 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .feature-card-modern {
          background: var(--white);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .feature-card-modern:hover {
          border-color: var(--teal);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }
        .feature-icon-box {
          width: 56px;
          height: 56px;
          background: var(--teal-light);
          color: var(--teal);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .feature-card-modern h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          margin-bottom: 12px;
        }
        .feature-card-modern p {
          color: var(--ink-muted);
          font-size: 15px;
          line-height: 1.6;
        }

        /* How it works */
        .how-it-works {
          padding: 100px 24px;
          background: var(--white);
          text-align: center;
        }
        .section-header h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          margin-bottom: 12px;
        }
        .section-header p {
          color: var(--ink-muted);
          margin-bottom: 60px;
        }
        .steps-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .step-card {
          position: relative;
          padding: 32px;
        }
        .step-number {
          font-size: 64px;
          font-weight: 900;
          color: var(--surface-2);
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          line-height: 1;
        }
        .step-icon {
          position: relative;
          z-index: 1;
          width: 48px;
          height: 48px;
          margin: 0 auto 20px;
          color: var(--teal);
        }
        .step-card h4 {
          position: relative;
          z-index: 1;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .step-card p {
          position: relative;
          z-index: 1;
          font-size: 14px;
          color: var(--ink-muted);
        }

        /* Footer */
        .trust-footer {
          padding: 60px 24px;
          text-align: center;
          border-top: 1px solid var(--border);
        }
        .trust-footer p {
          font-size: 14px;
          color: var(--ink-muted);
          margin-bottom: 24px;
        }
        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 24px;
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-soft);
          opacity: 0.6;
        }

        @media (max-width: 900px) {
          .features-grid, .steps-container {
            grid-template-columns: 1fr;
          }
          .hero-title { font-size: 40px; }
          .hero-stats { flex-direction: column; gap: 20px; }
          .stat-divider { display: none; }
        }
      `}} />
    </div>
  );
}

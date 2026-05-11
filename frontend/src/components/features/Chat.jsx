import React, { useState, useRef, useEffect } from "react";
import Markdown from "../shared/Markdown";
import { apiService } from "../../services/api";

export default function Chat({ sessionId }) {
  const [msgs, setMsgs] = useState([
    {
      role: "assistant",
      text: "Hi! I'm here to explain your recommended policy in plain language. Ask me anything — what is a waiting period? What's covered for your condition? I'll explain it simply.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const d = await apiService.sendMessage(sessionId, msg);
      setMsgs((m) => [...m, { role: "assistant", text: d.reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: "Connection error. Is the backend running?",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-avatar">✦</div>
        <div>
          <div className="chat-title">Policy Explainer</div>
          <div className="chat-status">Ask anything about your plan</div>
        </div>
      </div>

      <div className="chat-messages">
        {msgs.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <Markdown text={m.text} />
          </div>
        ))}
        {loading && (
          <div className="msg msg-assistant">
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      {msgs.length === 1 && (
        <div className="suggestions">
          {[
            "What is a waiting period?",
            "What does co-pay mean?",
            "Am I covered for my condition?",
          ].map((s) => (
            <button
              key={s}
              className="suggestion-chip"
              onClick={() => setInput(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your policy..."
        />
        <button
          className="send-btn"
          onClick={send}
          disabled={loading || !input.trim()}
        >
          →
        </button>
      </div>
    </div>
  );
}

const API_BASE_URL = "http://localhost:8000";

export const apiService = {
  async getRecommendation(sessionId, profile) {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, profile }),
    });
    if (!response.ok) throw new Error("Failed to get recommendation");
    return await response.json();
  },

  async sendMessage(sessionId, message) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, message }),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return await response.json();
  },

  async getPolicies(auth) {
    const response = await fetch(`${API_BASE_URL}/admin/policies`, {
      headers: { Authorization: auth },
    });
    if (!response.ok) throw new Error("Unauthorized or failed to fetch policies");
    return await response.json();
  },

  async uploadPolicy(auth, formData) {
    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: "POST",
      headers: { Authorization: auth },
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    return await response.json();
  },

  async deletePolicy(auth, name) {
    const response = await fetch(
      `${API_BASE_URL}/admin/policy/${encodeURIComponent(name)}`,
      {
        method: "DELETE",
        headers: { Authorization: auth },
      }
    );
    if (!response.ok) throw new Error("Delete failed");
    return await response.json();
  },
};

"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function sendMessage() {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/sms", {
        to: "8801958596840",
        message: "WHERE#",
      }, { timeout: 10000 });

      setResult(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data ?? err?.message ?? "Request failed";
      setResult(typeof msg === "string" ? msg : JSON.stringify(msg, null, 2));
    } finally {
      setLoading(false);
    }
  }

    async function sendStatus() {
    setStatusLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/sms", {
        to: "8801958596840",
        message: "STATUS#",
      }, { timeout: 10000 });

      setResult(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data ?? err?.message ?? "Request failed";
      setResult(typeof msg === "string" ? msg : JSON.stringify(msg, null, 2));
    } finally {
      setStatusLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send Message"}
      </button>

      <button onClick={sendStatus} disabled={statusLoading} style={{ marginLeft: 10 }}>
        {statusLoading ? "Sending..." : "Send Status"}
      </button>

      {result && (
        <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>{result}</pre>
      )}
    </div>
  );
}
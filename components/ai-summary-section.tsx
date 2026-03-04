"use client";

import { useState } from "react";

type Props = {
  type: "person" | "event";
  id: string;
  initialSummary: string | null;
  hasSourceText: boolean;
};

export function AiSummarySection({ type, id, initialSummary, hasSourceText }: Props) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestSummary(force = false) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, force })
      });

      const data = (await response.json()) as { ok: boolean; summary?: string; error?: string };

      if (!response.ok || !data.ok || !data.summary) {
        setError(data.error ?? "No se pudo generar el resumen.");
        return;
      }

      setSummary(data.summary);
    } catch {
      setError("No se pudo generar el resumen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Resumen IA</h2>
      {summary ? <p style={{ whiteSpace: "pre-line" }}>{summary}</p> : null}
      {error ? <p>{error}</p> : null}
      {!summary ? (
        <button type="button" onClick={() => requestSummary()} disabled={loading || !hasSourceText}>
          {loading ? "Generando resumen…" : "Resumir con IA"}
        </button>
      ) : null}
      {summary ? (
        <button type="button" onClick={() => requestSummary(true)} disabled={loading || !hasSourceText}>
          {loading ? "Generando resumen…" : "Regenerar resumen"}
        </button>
      ) : null}
      {!hasSourceText ? <p>No hay texto suficiente para resumir</p> : null}
    </section>
  );
}

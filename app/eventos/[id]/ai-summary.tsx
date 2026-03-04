"use client";

import { useState } from "react";

type Props = {
  id: string;
  initialSummary: string | null;
  hasSourceText: boolean;
  canSummarize: boolean;
};

type SummarizeResponse = {
  ok: boolean;
  summary?: string;
  ai_summary?: string;
  error?: string;
};

export function EventAiSummary({ id, initialSummary, hasSourceText, canSummarize }: Props) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestSummary() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "event", id, force: Boolean(summary) })
      });

      const data = (await response.json()) as SummarizeResponse;
      const returnedSummary = data.ai_summary ?? data.summary;

      if (!response.ok || !data.ok || !returnedSummary) {
        setError(data.error ?? "No se pudo generar el resumen.");
        return;
      }

      setSummary(returnedSummary);
    } catch {
      setError("No se pudo generar el resumen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      {summary ? <p style={{ whiteSpace: "pre-line" }}>{summary}</p> : null}
      {error ? <p>{error}</p> : null}
      {canSummarize ? (
        <>
          <button type="button" onClick={requestSummary} disabled={loading || !hasSourceText}>
            {loading ? "Generando resumen…" : summary ? "Regenerar resumen" : "Resumir con IA"}
          </button>
          {!hasSourceText ? <p>No hay texto suficiente para resumir.</p> : null}
        </>
      ) : null}
    </section>
  );
}

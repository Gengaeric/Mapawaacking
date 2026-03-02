"use client";

import { useState } from "react";

type BackfillResult = {
  ok: boolean;
  error?: string;
  peopleUpdated?: number;
  eventsUpdated?: number;
  failed?: number;
  totalUpdated?: number;
};

export function BackfillGeocodesButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BackfillResult | null>(null);

  async function runBackfill() {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/admin/backfill-geocodes", { method: "POST" });
      const data = (await response.json()) as BackfillResult;
      setResult(data);
    } catch {
      setResult({ ok: false, error: "No se pudo ejecutar el backfill." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h3>Geocoding</h3>
      <button onClick={runBackfill} disabled={loading}>
        {loading ? "Completando coordenadas..." : "Completar coordenadas faltantes"}
      </button>
      {result ? (
        result.ok ? (
          <p>
            Listo. Personas: {result.peopleUpdated} · Eventos: {result.eventsUpdated} · Fallidos: {result.failed}
          </p>
        ) : (
          <p>{result.error ?? "No se pudo completar la operación."}</p>
        )
      ) : null}
    </section>
  );
}

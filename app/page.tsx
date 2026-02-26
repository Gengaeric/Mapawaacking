"use client";

import { useState } from "react";
import Script from "next/script";

export default function HomePage() {
  const [leafletReady, setLeafletReady] = useState(false);

  return (
    <>
      <header className="encabezado">
        <h1>Cartografía espacio-temporal del Waacking en Argentina (2005–2026)</h1>
        <p>Prototipo A — Exploración histórica de personas y eventos de waacking.</p>
      </header>

      <main className="layout">
        <aside className="panel-control">
          <section>
            <h2>Línea temporal</h2>
            <label htmlFor="lustroSelect">Elegí un lustro</label>
            <select id="lustroSelect" />

            <label htmlFor="anioSelect">Elegí un año</label>
            <select id="anioSelect" />

            <p id="estadoTiempo" className="estado-tiempo" />
          </section>

          <section>
            <h2>Filtros</h2>

            <label htmlFor="tipoSelect">Tipo</label>
            <select id="tipoSelect" defaultValue="todos">
              <option value="todos">Todos</option>
              <option value="persona">Personas</option>
              <option value="evento">Eventos</option>
            </select>

            <label htmlFor="provinciaSelect">Provincia</label>
            <select id="provinciaSelect" defaultValue="todas">
              <option value="todas">Todas</option>
            </select>

            <label htmlFor="crewSelect">Crew/Club</label>
            <select id="crewSelect" defaultValue="todos">
              <option value="todos">Todos</option>
            </select>

            <label htmlFor="tipoEventoSelect">Tipo de evento</label>
            <select id="tipoEventoSelect" defaultValue="todos">
              <option value="todos">Todos</option>
            </select>

            <button id="limpiarFiltrosBtn" type="button">
              Limpiar filtros
            </button>
          </section>

          <section className="leyenda">
            <h2>Leyenda</h2>
            <div>
              <span className="muestra persona" /> Persona (pin)
            </div>
            <div>
              <span className="muestra evento" /> Evento (cuadrado)
            </div>
            <small>Los elementos más antiguos se ven con menor opacidad.</small>
          </section>
        </aside>

        <section className="mapa-y-ficha">
          <div id="map" />
          <article id="ficha" className="ficha">
            <h2>Ficha de detalle</h2>
            <p>Hacé clic en un marcador para ver su información.</p>
          </article>
        </section>
      </main>

      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        strategy="afterInteractive"
        onLoad={() => setLeafletReady(true)}
      />
      {leafletReady ? <Script src="/app.js" strategy="afterInteractive" /> : null}
    </>
  );
}

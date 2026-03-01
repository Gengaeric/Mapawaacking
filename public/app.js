const LUSTROS = [
  { id: "2005-2010", inicio: 2005, fin: 2010, etiqueta: "2005–2010" },
  { id: "2010-2015", inicio: 2010, fin: 2015, etiqueta: "2010–2015" },
  { id: "2015-2020", inicio: 2015, fin: 2020, etiqueta: "2015–2020" },
  { id: "2020-2025", inicio: 2020, fin: 2025, etiqueta: "2020–2025" },
  { id: "2025-2026", inicio: 2025, fin: 2026, etiqueta: "2025–2026" }
];

const DATA = { personas: [], eventos: [] };
const estado = {
  lustro: LUSTROS[0],
  anio: LUSTROS[0].inicio,
  filtros: { tipo: "todos", provincia: "todas", crewClub: "todos", tipoEvento: "todos" }
};

const mapa = L.map("map", { zoomControl: true }).setView([-38.4161, -63.6167], 4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap"
}).addTo(mapa);

const capaMarcadores = L.layerGroup().addTo(mapa);
const lustroSelect = document.getElementById("lustroSelect");
const anioSelect = document.getElementById("anioSelect");
const tipoSelect = document.getElementById("tipoSelect");
const provinciaSelect = document.getElementById("provinciaSelect");
const crewSelect = document.getElementById("crewSelect");
const tipoEventoSelect = document.getElementById("tipoEventoSelect");
const limpiarFiltrosBtn = document.getElementById("limpiarFiltrosBtn");
const estadoTiempo = document.getElementById("estadoTiempo");
const ficha = document.getElementById("ficha");
const iconoEvento = L.divIcon({ className: "evento-icono", iconSize: [16, 16], iconAnchor: [8, 8] });

function opacidadPorTiempo(anioDato, anioActual) {
  const diff = anioActual - anioDato;
  if (diff <= 1) return 1;
  if (diff <= 4) return 0.75;
  if (diff <= 8) return 0.55;
  return 0.35;
}

function cumpleFiltros(item) {
  if (estado.filtros.tipo !== "todos" && item.tipo !== estado.filtros.tipo) return false;
  if (estado.filtros.provincia !== "todas" && item.provincia !== estado.filtros.provincia) return false;
  if (item.tipo === "persona" && estado.filtros.crewClub !== "todos" && item.crewClub !== estado.filtros.crewClub)
    return false;
  if (item.tipo === "evento" && estado.filtros.tipoEvento !== "todos" && item.tipoEvento !== estado.filtros.tipoEvento)
    return false;
  return true;
}

function renderFicha(item) {
  if (item.tipo === "persona") {
    ficha.innerHTML = `<h2>Ficha de persona</h2><h3>${item.nombre}</h3><p>${item.ciudad}, ${item.provincia}</p><p>${item.bio}</p>`;
    return;
  }
  ficha.innerHTML = `<h2>Ficha de evento</h2><h3>${item.nombre}</h3><p>${item.fecha ?? ""} (${item.anio})</p><p>${item.ciudad}, ${item.provincia}</p><p>${item.descripcion}</p>`;
}

function render() {
  capaMarcadores.clearLayers();
  estadoTiempo.textContent = `Visualizando hasta el año ${estado.anio} del lustro ${estado.lustro.etiqueta}.`;
  const visibles = [];
  DATA.personas.forEach((p) => p.anioInicio <= estado.anio && cumpleFiltros(p) && visibles.push(p));
  DATA.eventos.forEach((e) => e.anio <= estado.anio && cumpleFiltros(e) && visibles.push(e));

  visibles.forEach((item) => {
    const opacidad = opacidadPorTiempo(item.tipo === "persona" ? item.anioInicio : item.anio, estado.anio);
    const marker =
      item.tipo === "persona"
        ? L.marker([item.lat, item.lng], { opacity: opacidad })
        : L.marker([item.lat, item.lng], { icon: iconoEvento, opacity: opacidad });
    marker.on("click", () => renderFicha(item));
    marker.addTo(capaMarcadores);
  });
}

function actualizarAniosPorLustro() {
  anioSelect.innerHTML = "";
  for (let a = estado.lustro.inicio; a <= estado.lustro.fin; a += 1) {
    const opt = document.createElement("option");
    opt.value = String(a);
    opt.textContent = String(a);
    anioSelect.appendChild(opt);
  }
  estado.anio = estado.lustro.inicio;
  anioSelect.value = String(estado.anio);
}

function cargarCombos() {
  LUSTROS.forEach((l, idx) => {
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = l.etiqueta;
    if (idx === 0) opt.selected = true;
    lustroSelect.appendChild(opt);
  });
  [...new Set([...DATA.personas, ...DATA.eventos].map((d) => d.provincia))].sort().forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    provinciaSelect.appendChild(opt);
  });
  [...new Set(DATA.personas.map((p) => p.crewClub))].sort().forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    crewSelect.appendChild(opt);
  });
  [...new Set(DATA.eventos.map((e) => e.tipoEvento))].sort().forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tipoEventoSelect.appendChild(opt);
  });
  actualizarAniosPorLustro();
}

lustroSelect.addEventListener("change", (e) => {
  estado.lustro = LUSTROS.find((l) => l.id === e.target.value) ?? LUSTROS[0];
  actualizarAniosPorLustro();
  render();
});
anioSelect.addEventListener("change", (e) => {
  estado.anio = Number(e.target.value);
  render();
});

tipoSelect.addEventListener("change", (e) => ((estado.filtros.tipo = e.target.value), render()));
provinciaSelect.addEventListener("change", (e) => ((estado.filtros.provincia = e.target.value), render()));
crewSelect.addEventListener("change", (e) => ((estado.filtros.crewClub = e.target.value), render()));
tipoEventoSelect.addEventListener("change", (e) => ((estado.filtros.tipoEvento = e.target.value), render()));
limpiarFiltrosBtn.addEventListener("click", () => {
  estado.filtros = { tipo: "todos", provincia: "todas", crewClub: "todos", tipoEvento: "todos" };
  tipoSelect.value = "todos";
  provinciaSelect.value = "todas";
  crewSelect.value = "todos";
  tipoEventoSelect.value = "todos";
  render();
});

async function init() {
  const response = await fetch("/api/map-data", { cache: "no-store" });
  const data = await response.json();
  DATA.personas = data.personas ?? [];
  DATA.eventos = data.eventos ?? [];
  cargarCombos();
  render();
}

init();

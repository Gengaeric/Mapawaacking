const LUSTROS = [
  { id: "2005-2010", inicio: 2005, fin: 2010, etiqueta: "2005–2010" },
  { id: "2010-2015", inicio: 2010, fin: 2015, etiqueta: "2010–2015" },
  { id: "2015-2020", inicio: 2015, fin: 2020, etiqueta: "2015–2020" },
  { id: "2020-2025", inicio: 2020, fin: 2025, etiqueta: "2020–2025" },
  { id: "2025-2026", inicio: 2025, fin: 2026, etiqueta: "2025–2026" }
];

function svgDataUri(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const DATA = {
  personas: [
    {
      id: "p-cami-disco",
      tipo: "persona",
      nombre: "Camila Rodríguez",
      nombreArtistico: "Cami Disco",
      ciudad: "Córdoba",
      provincia: "Córdoba",
      lat: -31.4201,
      lng: -64.1888,
      anioInicio: 2008,
      crewClub: "Disco Pulse Crew",
      bio: "Bailarina pionera en la escena local, impulsó entrenamientos abiertos y cruces con house y disco.",
      redes: "@cami.disco",
      foto: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#ff5fb2'/><stop offset='1' stop-color='#7c4dff'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><circle cx='80' cy='80' r='38' fill='#fff2'/><text x='160' y='105' font-size='26' fill='white' font-family='Arial' text-anchor='middle'>Cami Disco</text></svg>`
      ),
      participaciones: ["Jam Disco Córdoba (2009)", "Encuentro Federal Waacking (2016, 2018)"]
    },
    {
      id: "p-lu-disco",
      tipo: "persona",
      nombre: "Lucía Fernández",
      nombreArtistico: "Lú Disco",
      ciudad: "Rosario",
      provincia: "Santa Fe",
      lat: -32.9442,
      lng: -60.6505,
      anioInicio: 2013,
      crewClub: "Río Groove",
      bio: "Referente del litoral con foco en musicalidad y entrenamiento comunitario interprovincial.",
      redes: "@ludisco.waack",
      foto: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#1a2f6b'/><rect x='0' y='120' width='320' height='80' fill='#53c7ff'/><text x='160' y='95' font-size='26' fill='white' font-family='Arial' text-anchor='middle'>Lú Disco</text></svg>`
      ),
      participaciones: ["Batalla Brillo del Litoral (2014)", "Encuentro Federal Waacking (2017)"]
    },
    {
      id: "p-val-flash",
      tipo: "persona",
      nombre: "Valentina Sosa",
      nombreArtistico: "Val Flash",
      ciudad: "Mendoza",
      provincia: "Mendoza",
      lat: -32.8895,
      lng: -68.8458,
      anioInicio: 2019,
      crewClub: "Andes Waack Lab",
      bio: "Nueva generación cuyana, combina waacking con investigación escénica y producción audiovisual.",
      redes: "@valflash.moves",
      foto: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#2d1b4d'/><circle cx='240' cy='70' r='50' fill='#ff5fb2'/><text x='40' y='170' font-size='30' fill='white' font-family='Arial'>Val Flash</text></svg>`
      ),
      participaciones: ["Encuentro Federal Waacking (2019)"]
    }
  ],
  eventos: [
    {
      id: "e-jam-cordoba-2009",
      tipo: "evento",
      nombre: "Jam Disco Córdoba",
      tipoEvento: "jam",
      fecha: "2009-09-12",
      anio: 2009,
      ciudad: "Córdoba",
      provincia: "Córdoba",
      lat: -31.4201,
      lng: -64.1888,
      descripcion: "Jam fundacional de intercambio entre crews y social dance.",
      links: "instagram.com/jamdiscocba",
      fotoPortada: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#ff9f1c'/><text x='160' y='105' font-size='28' fill='#222' font-family='Arial' text-anchor='middle'>Jam Córdoba 2009</text></svg>`
      )
    },
    {
      id: "e-encuentro-federal-2016",
      tipo: "evento",
      nombre: "Encuentro Federal Waacking",
      tipoEvento: "workshop",
      fecha: "2016-08-20",
      anio: 2016,
      ciudad: "Buenos Aires",
      provincia: "Buenos Aires",
      lat: -34.6037,
      lng: -58.3816,
      descripcion: "Edición anual con clases, rondas y conversatorios sobre historia del waacking.",
      links: "encuentrofederalwaack.ar/2016",
      fotoPortada: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#2ec4b6'/><text x='160' y='90' font-size='24' fill='#0b1d26' font-family='Arial' text-anchor='middle'>Federal 2016</text><text x='160' y='130' font-size='18' fill='#0b1d26' font-family='Arial' text-anchor='middle'>Buenos Aires</text></svg>`
      )
    },
    {
      id: "e-encuentro-federal-2017",
      tipo: "evento",
      nombre: "Encuentro Federal Waacking",
      tipoEvento: "workshop",
      fecha: "2017-08-19",
      anio: 2017,
      ciudad: "Buenos Aires",
      provincia: "Buenos Aires",
      lat: -34.6037,
      lng: -58.3816,
      descripcion: "Continuidad del encuentro anual con invitadxs nacionales.",
      links: "encuentrofederalwaack.ar/2017",
      fotoPortada: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#2ec4b6'/><text x='160' y='105' font-size='28' fill='#0b1d26' font-family='Arial' text-anchor='middle'>Federal 2017</text></svg>`
      )
    },
    {
      id: "e-encuentro-federal-2018",
      tipo: "evento",
      nombre: "Encuentro Federal Waacking",
      tipoEvento: "workshop",
      fecha: "2018-08-18",
      anio: 2018,
      ciudad: "Buenos Aires",
      provincia: "Buenos Aires",
      lat: -34.6037,
      lng: -58.3816,
      descripcion: "Edición enfocada en formación docente y archivo comunitario.",
      links: "encuentrofederalwaack.ar/2018",
      fotoPortada: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#2ec4b6'/><text x='160' y='105' font-size='28' fill='#0b1d26' font-family='Arial' text-anchor='middle'>Federal 2018</text></svg>`
      )
    },
    {
      id: "e-encuentro-federal-2019",
      tipo: "evento",
      nombre: "Encuentro Federal Waacking",
      tipoEvento: "workshop",
      fecha: "2019-08-17",
      anio: 2019,
      ciudad: "Buenos Aires",
      provincia: "Buenos Aires",
      lat: -34.6037,
      lng: -58.3816,
      descripcion: "Edición con foco en profesionalización y producción de competencias.",
      links: "encuentrofederalwaack.ar/2019",
      fotoPortada: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#2ec4b6'/><text x='160' y='105' font-size='28' fill='#0b1d26' font-family='Arial' text-anchor='middle'>Federal 2019</text></svg>`
      )
    },
    {
      id: "e-batalla-litoral-2014",
      tipo: "evento",
      nombre: "Batalla Brillo del Litoral",
      tipoEvento: "competencia",
      fecha: "2014-11-22",
      anio: 2014,
      ciudad: "Rosario",
      provincia: "Santa Fe",
      lat: -32.9442,
      lng: -60.6505,
      descripcion: "Competencia regional con formato bracket 1vs1 y jurado invitado.",
      links: "brillolitoral.ar",
      fotoPortada: svgDataUri(
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='#e71d36'/><text x='160' y='105' font-size='26' fill='white' font-family='Arial' text-anchor='middle'>Brillo del Litoral</text></svg>`
      )
    }
  ]
};

const estado = {
  lustro: LUSTROS[0],
  anio: LUSTROS[0].inicio,
  filtros: {
    tipo: "todos",
    provincia: "todas",
    crewClub: "todos",
    tipoEvento: "todos"
  }
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

function cargarCombos() {
  LUSTROS.forEach((l, idx) => {
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = l.etiqueta;
    if (idx === 0) opt.selected = true;
    lustroSelect.appendChild(opt);
  });

  const provincias = [...new Set([...DATA.personas, ...DATA.eventos].map((d) => d.provincia))].sort();
  provincias.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    provinciaSelect.appendChild(opt);
  });

  const crews = [...new Set(DATA.personas.map((p) => p.crewClub))].sort();
  crews.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    crewSelect.appendChild(opt);
  });

  const tiposEvento = [...new Set(DATA.eventos.map((e) => e.tipoEvento))].sort();
  tiposEvento.push("otro");
  [...new Set(tiposEvento)].forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    tipoEventoSelect.appendChild(opt);
  });

  actualizarAniosPorLustro();
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

  if (item.tipo === "persona") {
    if (estado.filtros.crewClub !== "todos" && item.crewClub !== estado.filtros.crewClub) return false;
  }

  if (item.tipo === "evento") {
    if (estado.filtros.tipoEvento !== "todos" && item.tipoEvento !== estado.filtros.tipoEvento) return false;
  }

  return true;
}

function renderFicha(item) {
  if (item.tipo === "persona") {
    ficha.innerHTML = `
      <h2>Ficha de persona</h2>
      <h3>${item.nombre}</h3>
      <p class="subtitulo">Nombre artístico: ${item.nombreArtistico}</p>
      <ul class="lista-datos">
        <li><strong>Ciudad/Provincia:</strong> ${item.ciudad}, ${item.provincia}</li>
        <li><strong>Año de inicio:</strong> ${item.anioInicio}</li>
        <li><strong>Bio:</strong> ${item.bio}</li>
        <li><strong>Crew/Club:</strong> ${item.crewClub}</li>
        <li><strong>Redes:</strong> ${item.redes}</li>
        <li><strong>Participación destacada:</strong> ${item.participaciones.join("; ")}</li>
      </ul>
      <img class="foto-ficha" src="${item.foto}" alt="Foto de ${item.nombreArtistico}" />
    `;
    return;
  }

  ficha.innerHTML = `
    <h2>Ficha de evento</h2>
    <h3>${item.nombre}</h3>
    <p class="subtitulo">${item.tipoEvento.toUpperCase()}</p>
    <ul class="lista-datos">
      <li><strong>Fecha/Año:</strong> ${item.fecha} (${item.anio})</li>
      <li><strong>Ciudad/Provincia:</strong> ${item.ciudad}, ${item.provincia}</li>
      <li><strong>Descripción:</strong> ${item.descripcion}</li>
      <li><strong>Tipo:</strong> ${item.tipoEvento}</li>
      <li><strong>Links:</strong> ${item.links}</li>
    </ul>
    <img class="foto-ficha" src="${item.fotoPortada}" alt="Portada de ${item.nombre}" />
  `;
}

function render() {
  capaMarcadores.clearLayers();
  estadoTiempo.textContent = `Visualizando hasta el año ${estado.anio} del lustro ${estado.lustro.etiqueta}.`;

  const visibles = [];

  DATA.personas.forEach((p) => {
    if (p.anioInicio <= estado.anio && cumpleFiltros(p)) visibles.push(p);
  });

  DATA.eventos.forEach((e) => {
    if (e.anio <= estado.anio && cumpleFiltros(e)) visibles.push(e);
  });

  visibles.forEach((item) => {
    const anioDato = item.tipo === "persona" ? item.anioInicio : item.anio;
    const opacity = opacidadPorTiempo(anioDato, estado.anio);

    const marker =
      item.tipo === "persona"
        ? L.marker([item.lat, item.lng], { opacity })
        : L.marker([item.lat, item.lng], { icon: iconoEvento, opacity });

    marker.on("click", () => renderFicha(item));
    marker.bindTooltip(
      item.tipo === "persona"
        ? `${item.nombreArtistico} (${item.anioInicio})`
        : `${item.nombre} (${item.anio})`
    );
    marker.addTo(capaMarcadores);
  });
}

lustroSelect.addEventListener("change", (e) => {
  const seleccionado = LUSTROS.find((l) => l.id === e.target.value);
  estado.lustro = seleccionado;
  actualizarAniosPorLustro();
  render();
});

anioSelect.addEventListener("change", (e) => {
  estado.anio = Number(e.target.value);
  render();
});

tipoSelect.addEventListener("change", (e) => {
  estado.filtros.tipo = e.target.value;
  render();
});

provinciaSelect.addEventListener("change", (e) => {
  estado.filtros.provincia = e.target.value;
  render();
});

crewSelect.addEventListener("change", (e) => {
  estado.filtros.crewClub = e.target.value;
  render();
});

tipoEventoSelect.addEventListener("change", (e) => {
  estado.filtros.tipoEvento = e.target.value;
  render();
});

limpiarFiltrosBtn.addEventListener("click", () => {
  estado.filtros = {
    tipo: "todos",
    provincia: "todas",
    crewClub: "todos",
    tipoEvento: "todos"
  };

  tipoSelect.value = "todos";
  provinciaSelect.value = "todas";
  crewSelect.value = "todos";
  tipoEventoSelect.value = "todos";
  render();
});

cargarCombos();
render();

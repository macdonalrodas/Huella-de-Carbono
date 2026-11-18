// Paleta en JavaScript para los gráficos (SVG de Recharts y Leaflet).
// Son exactamente los mismos valores de styles/theme.css: los atributos
// de SVG no siempre aceptan variables CSS, por eso se repiten aquí.
export const COLORES = {
  verdeBosque: "#0b5d45",
  azul: "#0072b2",
  naranja: "#d55e00",
  grisPizarra: "#4a5568",
  ambar: "#e69f00",
  azulCielo: "#56b4e9",
  rosa: "#cc79a7",

  verdeMedio: "#6fa58f",
  verdeClaro: "#b9d3c7",
  verdeFondo: "#e7f0ec",
  naranjaFondo: "#fbe9dd",

  mapa: ["#cbd2d9", "#fdf0d5", "#f6c86b", "#e69f00", "#d55e00", "#8c3a0e"], // [sin datos, clase 1..5]

  texto: "#1a202c",
  textoTenue: "#8a94a3",
  borde: "#e2e8f0",
  rejilla: "#edf0f3",
};

export const reduccionAumento = (v) => (v < 0 ? COLORES.azul : COLORES.naranja);

// Continentes: nombre en los datos (OWID) → etiqueta en español, letra y color.
// Los mismos colores se usan en la dispersión PIB–emisiones y en
// "Emisiones por continente", para que un continente siempre se lea igual.
export const CONTINENTES = [
  { clave: "Africa", nombre: "África", letra: "A", color: "var(--azul)", hex: "#0072b2" },
  { clave: "Asia", nombre: "Asia", letra: "B", color: "var(--naranja)", hex: "#d55e00" },
  { clave: "Europe", nombre: "Europa", letra: "C", color: "var(--ambar)", hex: "#e69f00" },
  { clave: "North America", nombre: "Norteamérica", letra: "D", color: "var(--azul-cielo)", hex: "#56b4e9" },
  { clave: "South America", nombre: "Sudamérica", letra: "E", color: "var(--rosa)", hex: "#cc79a7" },
  { clave: "Oceania", nombre: "Oceanía", letra: "F", color: "var(--gris-pizarra)", hex: "#4a5568" },
];

export const continentePorClave = Object.fromEntries(CONTINENTES.map((c) => [c.clave, c]));

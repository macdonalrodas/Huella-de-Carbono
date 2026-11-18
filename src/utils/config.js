// =========================================================
// Parámetros del dashboard. Son los mismos criterios que se
// usaron en la limpieza de datos (Colab), en un solo lugar.
// =========================================================

export const ANIO_INI = 2010;
export const ANIO_FIN = 2023;

// KPI "Mayor mejora ambiental"
export const UMBRAL_MT = 50; // solo países con al menos 50 Mt en 2010
export const EXCLUIDOS_MEJORA = ["UKR", "SYR", "VEN"]; // caídas por guerra o colapso económico

// Mapa: cortes de clase de CO2 per cápita (t/hab). 5 clases:
// < 1 | 1–3 | 3–6 | 6–10 | ≥ 10
export const CORTES_MAPA = [1, 3, 6, 10];

// Contribución por sector: años de las barras y agrupación de sectores.
// Se excluye "cambio de uso de suelo", porque puede ser negativo
// (absorción) y no permite barras al 100 %.
export const ANIOS_SECTORES = [2010, 2016, 2023];
export const GRUPOS_SECTOR = [
  {
    clave: "electricidad",
    nombre: "Electricidad y calor",
    color: "var(--verde-bosque)",
    columnas: ["electricity_and_heat_co2_emissions"],
  },
  {
    clave: "transporte",
    nombre: "Transporte",
    color: "var(--verde-medio)",
    columnas: ["transport_co2_emissions", "aviation_and_shipping_co2_emissions"],
  },
  {
    clave: "industria",
    nombre: "Industria y otros",
    color: "var(--verde-claro)",
    columnas: [
      "manufacturing_and_construction_co2_emissions",
      "industry_co2_emissions",
      "buildings_co2_emissions",
      "other_fuel_combustion_co2_emissions",
      "fugitive_co2_emissions",
    ],
  },
];

// Colores de las 5 líneas del KPI principal (en orden del ranking)
export const COLORES_TOP5 = ["#0b5d45", "#e69f00", "#56b4e9", "#cc79a7", "#4a5568"];

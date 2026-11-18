// Íconos lineales simples (SVG) para las tarjetas de KPI
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const IconoBarras = () => (
  <svg {...base}>
    <path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" />
  </svg>
);

export const IconoPersona = () => (
  <svg {...base}>
    <circle cx="12" cy="6" r="3" />
    <path d="M12 9v6M8 12h8M10 21l2-6 2 6" />
  </svg>
);

export const IconoTendencia = () => (
  <svg {...base}>
    <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
  </svg>
);

export const IconoHoja = () => (
  <svg {...base}>
    <path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15" />
    <path d="M5 19l7-7" />
  </svg>
);

export const IconoMedidor = () => (
  <svg {...base}>
    <path d="M4 17a8 8 0 1 1 16 0" />
    <path d="M12 17l4-5" />
  </svg>
);

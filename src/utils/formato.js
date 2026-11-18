// Formato de números en español (México): 290,557 · 4.7 · −50.4 %

const nf = (decimales) =>
  new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });

export const numero = (v, decimales = 0) =>
  v == null || Number.isNaN(v) ? "—" : nf(decimales).format(v);

// Porcentaje con signo: +14.3 % / −50.4 %
export const porcentaje = (v, decimales = 1) => {
  if (v == null || Number.isNaN(v)) return "—";
  const signo = v > 0 ? "+" : v < 0 ? "−" : "";
  return `${signo}${nf(decimales).format(Math.abs(v))} %`;
};

// Grados con signo: +1.47 °C
export const grados = (v, decimales = 2) => {
  if (v == null || Number.isNaN(v)) return "—";
  const signo = v > 0 ? "+" : v < 0 ? "−" : "";
  return `${signo}${nf(decimales).format(Math.abs(v))} °C`;
};

// Valores grandes para ejes: 1,500 → 1.5 mil · 2,500,000 → 2.5 M
export const compacto = (v) =>
  new Intl.NumberFormat("es-MX", { notation: "compact", maximumFractionDigits: 1 }).format(v);

// Población legible: 1.4 mil M / 126 M
export const poblacion = (v) => {
  if (v == null) return "—";
  if (v >= 1e9) return `${numero(v / 1e9, 2)} mil M`;
  if (v >= 1e6) return `${numero(v / 1e6, 1)} M`;
  return numero(v);
};

import { useEffect, useState } from "react";
import { traerTabla } from "./lib/supabase";

const TABLAS = [
  "co2_maestro", "sectores", "regiones", "kpi_variacion",
  "kpi_mapa_per_capita_cambio", "kpi_pib_emisiones_cambio", "kpi_resumen",
];

export default function App() {
  const [conteos, setConteos] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all(TABLAS.map((t) => traerTabla(t).then((d) => [t, d.length])))
      .then((pares) => setConteos(Object.fromEntries(pares)))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {TABLAS.map((t) => (
        <li key={t}>{t}: {conteos[t] ?? "cargando..."}</li>
      ))}
    </ul>
  );
}
import { useEffect, useState } from "react";
import { traerTabla } from "../lib/supabase";

// Tablas de Supabase → nombre con el que se usan en el código
const TABLAS = {
  maestro: "co2_maestro",
  sectores: "sectores",
  regiones: "regiones",
  variacion: "kpi_variacion",
  mapaCambio: "kpi_mapa_per_capita_cambio",
  pibCambio: "kpi_pib_emisiones_cambio",
  resumen: "kpi_resumen",
  paises: "paises",
  temperatura: "temperatura",
};

// Carga todas las tablas una sola vez, en paralelo.
// Devuelve { datos, cargando, error }.
export function useDatos() {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });

  useEffect(() => {
    let activo = true;
    const claves = Object.keys(TABLAS);

    Promise.all(claves.map((k) => traerTabla(TABLAS[k])))
      .then((resultados) => {
        if (!activo) return;
        const datos = Object.fromEntries(claves.map((k, i) => [k, resultados[i]]));
        setEstado({ datos, cargando: false, error: null });
      })
      .catch((e) => activo && setEstado({ datos: null, cargando: false, error: e.message }));

    return () => {
      activo = false;
    };
  }, []);

  return estado;
}

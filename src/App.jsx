import { useEffect, useMemo } from "react";
import { FiltrosProvider } from "./context/FiltrosContext";
import { useDatos } from "./hooks/useDatos";
import { prepararBase, verificarConsistencia } from "./utils/calculos";
import Header from "./components/layout/Header";
import Filtros from "./components/layout/Filtros";
import FilaKpis from "./components/kpis/FilaKpis";
import GraficoTop5 from "./components/graficos/GraficoTop5";
import GraficoMejora from "./components/graficos/GraficoMejora";
import MapaPerCapita from "./components/mapa/MapaPerCapita";
import GraficoVariacion from "./components/graficos/GraficoVariacion";
import GraficoPib from "./components/graficos/GraficoPib";
import TarjetaTemperatura from "./components/graficos/TarjetaTemperatura";
import TarjetaNotas from "./components/graficos/TarjetaNotas";
import GraficoContinentes from "./components/graficos/GraficoContinentes";
import GraficoSectores from "./components/graficos/GraficoSectores";
import styles from "./App.module.css";

export default function App() {
  const { datos, cargando, error } = useDatos();

  // Índices y lookups: se calculan una sola vez cuando llegan los datos
  const base = useMemo(() => (datos ? prepararBase(datos) : null), [datos]);

  // Compara los KPIs calculados en React con los de Colab (ver consola)
  useEffect(() => {
    if (base) verificarConsistencia(base);
  }, [base]);

  if (cargando) return <Estado mensaje="Cargando datos desde Supabase…" />;
  if (error) return <Estado mensaje={`No se pudieron cargar los datos: ${error}`} error />;

  return (
    <FiltrosProvider>
      <Header />
      <Filtros paises={base.paises} />

      <main className={styles.contenedor}>
        {/* Fila 1: KPIs (el principal es más ancho, como en el wireframe) */}
        <FilaKpis base={base} />

        {/* Filas 2 a 5: gráficos en dos columnas (2/3 y 1/3) */}
        <div className={styles.cuadricula}>
          <GraficoTop5 base={base} />
          <GraficoMejora base={base} />
          <MapaPerCapita base={base} />
          <GraficoVariacion base={base} />
          <GraficoPib base={base} />
          <div className={styles.columnaApilada} style={{ gridArea: "lateral" }}>
            <TarjetaTemperatura base={base} />
            <TarjetaNotas base={base} />
          </div>
          <GraficoContinentes base={base} />
          <GraficoSectores base={base} />
        </div>
      </main>

      <footer className={styles.pie}>
        Fuente: Our World in Data · Datos procesados 2010–2023
      </footer>
    </FiltrosProvider>
  );
}

function Estado({ mensaje, error }) {
  return (
    <>
      <Header />
      <div className={`${styles.estado} ${error ? styles.estadoError : ""}`}>{mensaje}</div>
    </>
  );
}

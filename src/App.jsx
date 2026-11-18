import { useEffect, useMemo } from "react";
import { FiltrosProvider } from "./context/FiltrosContext";
import { useDatos } from "./hooks/useDatos";
import { prepararBase, verificarConsistencia } from "./utils/calculos";
import Header from "./components/layout/Header";
import Filtros from "./components/layout/Filtros";
import Tarjeta from "./components/layout/Tarjeta";
import FilaKpis from "./components/kpis/FilaKpis";
import GraficoTop5 from "./components/graficos/GraficoTop5";
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
          <Tarjeta area="mejora" titulo="Mayor mejora ambiental" subtitulo="Evolución del CO₂ per cápita frente al promedio mundial" etiqueta="2010–2023" />
          <Tarjeta area="mapa" titulo="CO₂ per cápita por país" subtitulo="Distribución mundial por clases · toneladas por habitante" />
          <Tarjeta area="variacion" titulo="Variación 2010–2023" subtitulo="Cambio porcentual de las emisiones por país" />
          <Tarjeta area="pib" titulo="PIB y emisiones" subtitulo="PIB per cápita vs. CO₂ per cápita · escala logarítmica" />
          <div className={styles.columnaApilada} style={{ gridArea: "lateral" }}>
            <Tarjeta titulo="Cambio de temperatura global" />
            <Tarjeta titulo="Notas y cobertura" />
          </div>
          <Tarjeta area="continentes" titulo="Emisiones por continente" subtitulo="Evolución anual de emisiones de CO₂ · 2010–2023" etiqueta="2010–2023" />
          <Tarjeta area="sectores" titulo="Contribución por sector" subtitulo="Participación en emisiones globales" />
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

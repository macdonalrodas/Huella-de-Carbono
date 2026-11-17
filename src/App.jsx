import { useEffect, useState } from "react";
import { FiltrosProvider } from "./context/FiltrosContext";
import { traerTabla } from "./lib/supabase";
import Header from "./components/layout/Header";
import Filtros from "./components/layout/Filtros";
import Tarjeta from "./components/layout/Tarjeta";
import styles from "./App.module.css";

export default function App() {
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    traerTabla("paises").then(setPaises).catch(console.error);
  }, []);

  return (
    <FiltrosProvider>
      <Header />
      <Filtros paises={paises} />

      <main className={styles.contenedor}>
        {/* Fila 1: KPIs (el principal es más ancho, como en el wireframe) */}
        <div className={styles.kpis}>
          <div className={`${styles.kpiTemporal} ${styles.kpiPrincipal}`}>KPI principal</div>
          <div className={styles.kpiTemporal}>CO₂ per cápita</div>
          <div className={styles.kpiTemporal}>Variación 2010–2023</div>
          <div className={styles.kpiTemporal}>Mayor mejora</div>
          <div className={styles.kpiTemporal}>Intensidad de carbono</div>
        </div>

        {/* Filas 2 a 5: gráficos en dos columnas (2/3 y 1/3) */}
        <div className={styles.cuadricula}>
          <Tarjeta area="top5" titulo="¿Quién concentra las emisiones?" subtitulo="Evolución anual y acumulado de los cinco mayores emisores" etiqueta="2010–2023" />
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

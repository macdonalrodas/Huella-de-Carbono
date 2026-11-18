import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer } from "react-leaflet";
import { ANIOS, useFiltros } from "../../context/FiltrosContext";
import { COLORES } from "../../lib/colores";
import { claseMapa, datosMapa } from "../../utils/calculos";
import { CORTES_MAPA } from "../../utils/config";
import { numero } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import styles from "./MapaPerCapita.module.css";

// Límites del mundo (sin la Antártida) para encuadrar el mapa
const LIMITES_MUNDO = [
  [-56, -168],
  [80, 180],
];

// Etiquetas de las 5 clases a partir de los cortes de config.js
const ETIQUETAS_CLASE = [
  `< ${CORTES_MAPA[0]}`,
  ...CORTES_MAPA.slice(0, -1).map((c, i) => `${c}–${CORTES_MAPA[i + 1]}`),
  `≥ ${CORTES_MAPA[CORTES_MAPA.length - 1]}`,
];

// Código ISO3 de cada país en Natural Earth.
// (En Natural Earth algunos países, como Francia o Noruega, tienen ISO_A3 = "-99";
// por eso se revisan varias propiedades en orden.)
const codigoIso3 = (props) =>
  [props.ISO_A3_EH, props.ISO_A3, props.ADM0_A3].find((c) => c && c !== "-99") ?? null;

export default function MapaPerCapita({ base }) {
  const { anio, setAnio, continente, pais } = useFiltros();
  const [mundo, setMundo] = useState(null);

  // El GeoJSON se descarga una vez desde public/data
  useEffect(() => {
    fetch("/data/mundo.geojson")
      .then((r) => r.json())
      .then((geo) => {
        geo.features = geo.features.filter((f) => codigoIso3(f.properties) !== "ATA");
        setMundo(geo);
      })
      .catch(console.error);
  }, []);

  const valores = useMemo(() => datosMapa(base, anio), [base, anio]);

  const estilo = (feature) => {
    const iso3 = codigoIso3(feature.properties);
    const fila = valores[iso3];
    const clase = claseMapa(fila?.co2_pc_t);
    const fueraDeContinente = continente !== "todos" && base.continenteDe[iso3] !== continente;
    const seleccionado = iso3 === pais;
    return {
      fillColor: COLORES.mapa[clase],
      fillOpacity: fueraDeContinente ? 0.25 : 0.95,
      color: seleccionado ? COLORES.texto : "#ffffff",
      weight: seleccionado ? 2.5 : 0.6,
    };
  };

  const alCrearPais = (feature, capa) => {
    const iso3 = codigoIso3(feature.properties);
    const fila = valores[iso3];
    const nombre = base.nombreDe[iso3] ?? feature.properties.NAME_ES ?? feature.properties.NAME;
    const clase = claseMapa(fila?.co2_pc_t);
    const detalle = fila?.co2_pc_t != null
      ? `<strong>${numero(fila.co2_pc_t, 1)} t/hab</strong> · clase ${clase} (${ETIQUETAS_CLASE[clase - 1]})`
      : "Sin datos";
    capa.bindTooltip(`<div class="${styles.tip}"><b>${nombre}</b><br/>${detalle}<br/><span>${anio}</span></div>`, {
      sticky: true,
      direction: "top",
      opacity: 1,
    });
    capa.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 2, color: COLORES.texto });
        e.target.bringToFront();
      },
      mouseout: (e) => e.target.setStyle(estilo(feature)),
    });
    if (iso3 === pais) capa.bringToFront();
  };

  const selectorAnio = (
    <label className={styles.selector}>
      <span>Año</span>
      <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
        {ANIOS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <Tarjeta
      area="mapa"
      titulo="CO₂ per cápita por país"
      subtitulo="Distribución mundial por clases · toneladas por habitante"
      accion={selectorAnio}
    >
      <div className={styles.mapa}>
        {mundo ? (
          <MapContainer
            bounds={LIMITES_MUNDO}
            maxBounds={[
              [-70, -200],
              [88, 200],
            ]}
            zoomSnap={0.25}
            minZoom={1}
            maxZoom={6}
            scrollWheelZoom={false}
            worldCopyJump={false}
            attributionControl={true}
            className={styles.contenedorMapa}
          >
            <GeoJSON
              key={`${anio}-${continente}-${pais}`}
              data={mundo}
              style={estilo}
              onEachFeature={alCrearPais}
              attribution="Fronteras: Natural Earth"
            />
          </MapContainer>
        ) : (
          <p className={styles.cargando}>Cargando mapa…</p>
        )}
      </div>

      <div className={styles.pie}>
        <span className={styles.nota}>
          Año activo: {anio} · Pasa el cursor sobre un país para ver su valor
        </span>
        <div className={styles.leyenda}>
          <span>Menor</span>
          {ETIQUETAS_CLASE.map((etiqueta, i) => (
            <span key={etiqueta} className={styles.clase}>
              <i style={{ background: COLORES.mapa[i + 1] }}>{i + 1}</i>
              {etiqueta}
            </span>
          ))}
          <span>Mayor</span>
          <span className={styles.clase}>
            <i style={{ background: COLORES.mapa[0] }} />
            Sin datos
          </span>
        </div>
      </div>
    </Tarjeta>
  );
}

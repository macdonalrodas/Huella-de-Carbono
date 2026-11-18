import { Area, AreaChart, ReferenceArea, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFiltros } from "../../context/filtros";
import { COLORES } from "../../lib/colores";
import { datosTemperatura } from "../../utils/calculos";
import { ANIO_FIN, ANIO_INI } from "../../utils/config";
import { grados } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import CajaTooltip from "./Tooltip";
import styles from "./TarjetaTemperatura.module.css";

// "Cambio de temperatura global": anomalía respecto a 1861–1890 (preindustrial)
export default function TarjetaTemperatura({ base }) {
  const { anio } = useFiltros();
  const { serie, valor, cambioDesde2010 } = datosTemperatura(base, anio);

  return (
    <Tarjeta titulo="Cambio de temperatura global" etiqueta={anio}>
      <div className={styles.contenido}>
        <div className={styles.cifra}>
          <strong>{grados(valor, 2)}</strong>
          <span>respecto al periodo preindustrial (1861–1890)</span>
          {anio !== ANIO_INI && <span className={styles.cambio}>{grados(cambioDesde2010, 2)} desde 2010</span>}
        </div>

        <div className={styles.curva}>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={serie} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
              <XAxis dataKey="anio" type="number" domain={["dataMin", "dataMax"]} hide />
              <YAxis domain={["dataMin - 0.1", "dataMax + 0.1"]} hide />
              {/* Periodo del dashboard resaltado */}
              <ReferenceArea x1={ANIO_INI} x2={ANIO_FIN} fill={COLORES.naranjaFondo} fillOpacity={0.9} />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <CajaTooltip titulo={label} filas={[{ color: COLORES.naranja, nombre: "Anomalía", valor: grados(payload[0].value, 2) }]} />
                  ) : null
                }
              />
              <Area
                dataKey="anomalia_c"
                stroke={COLORES.naranja}
                strokeWidth={1.8}
                fill={COLORES.naranja}
                fillOpacity={0.12}
                dot={false}
                isAnimationActive={false}
                baseValue="dataMin"
              />
              {valor != null && (
                <ReferenceDot x={anio} y={valor} r={4.5} fill={COLORES.naranja} stroke="#fff" strokeWidth={2} />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <div className={styles.ejes}>
            <span>{serie[0]?.anio}</span>
            <span className={styles.periodo}>2010–2023</span>
            <span>{serie[serie.length - 1]?.anio}</span>
          </div>
        </div>
      </div>
      <p className={styles.fuente}>Fuente: Met Office Hadley Centre (HadCRUT5), vía Our World in Data</p>
    </Tarjeta>
  );
}

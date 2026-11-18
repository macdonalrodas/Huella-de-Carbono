import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFiltros } from "../../context/filtros";
import { COLORES, reduccionAumento } from "../../lib/colores";
import { datosVariacion, MODOS_VARIACION } from "../../utils/calculos";
import { UMBRAL_MT } from "../../utils/config";
import { numero, porcentaje } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import CajaTooltip from "./Tooltip";
import styles from "./GraficoVariacion.module.css";

const ALTO_FILA = 30;

// "Variación 2010–2023": barras divergentes (azul = reducción, naranja = aumento)
export default function GraficoVariacion({ base }) {
  const filtros = useFiltros();
  const [modo, setModo] = useState("top10");
  const datos = datosVariacion(base, modo, filtros);

  // Eje simétrico alrededor de 0, redondeado a múltiplos de 25 %
  const maxAbs = Math.max(25, ...datos.map((d) => Math.abs(d.variacion_pct)));
  const limite = Math.ceil(maxAbs / 25) * 25;

  return (
    <Tarjeta area="variacion" titulo="Variación 2010–2023" subtitulo="Cambio porcentual de las emisiones por país">
      <select className={styles.selector} value={modo} onChange={(e) => setModo(e.target.value)}>
        {MODOS_VARIACION.map((m) => (
          <option key={m.clave} value={m.clave}>
            {m.nombre}
          </option>
        ))}
      </select>

      {datos.length === 0 ? (
        <p className={styles.vacio}>No hay países que cumplan este criterio en el continente elegido.</p>
      ) : (
        <ResponsiveContainer width="100%" height={datos.length * ALTO_FILA + 40}>
          <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 48, bottom: 4, left: 8 }} barCategoryGap={6}>
            <CartesianGrid stroke={COLORES.rejilla} horizontal={false} />
            <XAxis
              type="number"
              domain={[-limite, limite]}
              ticks={[-limite, -limite / 2, 0, limite / 2, limite]}
              tickFormatter={(v) => porcentaje(v, 0)}
              tick={{ fontSize: 10, fill: COLORES.textoTenue }}
              tickLine={false}
              axisLine={false}
              orientation="top"
            />
            <YAxis
              type="category"
              dataKey="pais"
              width={112}
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={(props) => <EtiquetaPais {...props} datos={datos} />}
            />
            <ReferenceLine x={0} stroke={COLORES.textoTenue} />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <CajaTooltip
                    titulo={d.pais}
                    filas={[
                      { nombre: "2010", valor: `${numero(d.co2_inicio_mt, 1)} Mt` },
                      { nombre: "2023", valor: `${numero(d.co2_fin_mt, 1)} Mt` },
                      { color: reduccionAumento(d.variacion_pct), nombre: "Variación", valor: porcentaje(d.variacion_pct) },
                    ]}
                    nota={d.agregado ? `País seleccionado (no está en la lista por criterio o por emitir < ${UMBRAL_MT} Mt en 2010)` : null}
                  />
                );
              }}
            />
            <Bar dataKey="variacion_pct" isAnimationActive={false} radius={2}>
              {datos.map((d) => (
                <Cell
                  key={d.iso3}
                  fill={reduccionAumento(d.variacion_pct)}
                  fillOpacity={filtros.pais !== "todos" && !d.seleccionado ? 0.35 : 1}
                />
              ))}
              <LabelList dataKey="variacion_pct" content={<EtiquetaValor />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className={styles.leyenda}>
        <span>
          <i style={{ background: COLORES.azul }} /> Reducción
        </span>
        <span>
          <i style={{ background: COLORES.naranja }} /> Aumento
        </span>
      </div>
      <p className={styles.nota}>Países con al menos {UMBRAL_MT} Mt de CO₂ en 2010</p>
    </Tarjeta>
  );
}

// Nombre del país en el eje (en negritas si está seleccionado)
function EtiquetaPais({ x, y, payload, datos }) {
  const d = datos.find((v) => v.pais === payload.value);
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fill={COLORES.texto} fontWeight={d?.seleccionado ? 700 : 400}>
      {payload.value}
    </text>
  );
}

// Valor al final de cada barra: a la derecha si aumenta, a la izquierda si baja
function EtiquetaValor({ x, y, width, height, value }) {
  if (value == null) return null;
  const extremo = value < 0 ? Math.min(x, x + width) : Math.max(x, x + width);
  return (
    <text
      x={extremo + (value < 0 ? -5 : 5)}
      y={y + height / 2}
      dy={4}
      textAnchor={value < 0 ? "end" : "start"}
      fontSize={10}
      fill={COLORES.texto}
    >
      {porcentaje(value)}
    </text>
  );
}

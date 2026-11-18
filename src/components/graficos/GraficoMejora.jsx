import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFiltros } from "../../context/filtros";
import { COLORES } from "../../lib/colores";
import { mayorMejora } from "../../utils/calculos";
import { numero, porcentaje } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import CajaTooltip from "./Tooltip";
import styles from "./GraficoMejora.module.css";

const FONDO_AREA = "#e3f0f8";

// "Mayor mejora ambiental": CO2 per cápita del país vs. promedio mundial
export default function GraficoMejora({ base }) {
  const filtros = useFiltros();
  const mejora = mayorMejora(base, filtros);

  if (!mejora) {
    return (
      <Tarjeta area="mejora" titulo="Mayor mejora ambiental" etiqueta="2010–2023">
        <p className={styles.vacio}>
          Ningún país de este continente con al menos 50 Mt en 2010 redujo sus emisiones entre 2010 y 2023.
        </p>
      </Tarjeta>
    );
  }

  const { serie } = mejora;
  const ultimo = serie.length - 1;
  const maxY = Math.ceil(Math.max(...serie.flatMap((s) => [s.pais, s.mundo])) + 1);

  return (
    <Tarjeta
      area="mejora"
      titulo={`Mayor mejora ambiental · ${mejora.pais}`}
      subtitulo="Evolución del CO₂ per cápita frente al promedio mundial"
      etiqueta="2010–2023"
    >
      <div className={styles.cifra}>
        <strong>{porcentaje(mejora.variacionPerCapita)}</strong>
        <span>CO₂ per cápita entre 2010 y 2023</span>
        <span className={styles.nota}>Emisiones totales: {porcentaje(mejora.variacionTotal)}</span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={serie} margin={{ top: 22, right: 24, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={COLORES.rejilla} vertical={false} />
          <XAxis
            dataKey="anio"
            ticks={[2010, 2023]}
            tick={{ fontSize: 11, fill: COLORES.textoTenue }}
            tickLine={false}
            axisLine={{ stroke: COLORES.borde }}
          />
          <YAxis
            width={34}
            domain={[0, maxY]}
            tick={{ fontSize: 11, fill: COLORES.textoTenue }}
            tickFormatter={(v) => numero(v, 0)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <CajaTooltip
                  titulo={label}
                  filas={[
                    { color: COLORES.azul, nombre: mejora.pais, valor: `${numero(payload[0].payload.pais, 1)} t/hab` },
                    { color: COLORES.textoTenue, nombre: "Promedio mundial", valor: `${numero(payload[0].payload.mundo, 1)} t/hab` },
                  ]}
                />
              ) : null
            }
          />
          <Area
            dataKey="pais"
            stroke={COLORES.azul}
            strokeWidth={3}
            fill={FONDO_AREA}
            fillOpacity={1}
            isAnimationActive={false}
            dot={(props) => (
              <PuntoExtremo key={props.index} {...props} mostrar={props.index === 0 || props.index === ultimo} />
            )}
            activeDot={{ r: 4 }}
          />
          <Line
            dataKey="mundo"
            stroke={COLORES.textoTenue}
            strokeWidth={1.5}
            strokeDasharray="6 5"
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className={styles.leyenda}>
        <span>
          <i className={styles.lineaPais} /> {mejora.pais}
        </span>
        <span>
          <i className={styles.lineaMundo} /> Promedio mundial
        </span>
      </div>
    </Tarjeta>
  );
}

// Círculo y valor en el primer y último año
function PuntoExtremo({ cx, cy, value, index, mostrar }) {
  if (!mostrar || cx == null || cy == null) return <g />;
  const valor = Array.isArray(value) ? value[1] : value;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#fff" stroke={COLORES.azul} strokeWidth={3} />
      <text
        x={cx}
        y={cy - 12}
        textAnchor={index === 0 ? "start" : "end"}
        fontSize={11}
        fontWeight={600}
        fill={COLORES.texto}
      >
        {numero(valor, 1)} t/hab
      </text>
    </g>
  );
}

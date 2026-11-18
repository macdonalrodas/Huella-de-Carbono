import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFiltros } from "../../context/FiltrosContext";
import { COLORES } from "../../lib/colores";
import { CONTINENTES, continentePorClave } from "../../lib/continentes";
import { datosContinentes } from "../../utils/calculos";
import { numero } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import CajaTooltip from "./Tooltip";
import styles from "./GraficoContinentes.module.css";

// "Emisiones por continente": evolución anual 2010–2023
export default function GraficoContinentes({ base }) {
  const { continente } = useFiltros();
  const serie = datosContinentes(base);
  const ultimo = serie.length - 1;
  const hayDestacado = continente !== "todos";

  return (
    <Tarjeta
      area="continentes"
      titulo="Emisiones por continente"
      subtitulo="Evolución anual de emisiones de CO₂ · 2010–2023"
      accion={
        <div className={styles.leyenda}>
          {CONTINENTES.map((c) => (
            <span key={c.clave} className={hayDestacado && c.clave !== continente ? styles.atenuado : ""}>
              <i style={{ background: c.hex }}>{c.letra}</i>
              {c.nombre}
            </span>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={serie} margin={{ top: 10, right: 56, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={COLORES.rejilla} />
          <XAxis
            dataKey="anio"
            ticks={[2010, 2013, 2016, 2020, 2023]}
            tick={{ fontSize: 11, fill: COLORES.textoTenue }}
            tickLine={false}
            axisLine={{ stroke: COLORES.borde }}
          />
          <YAxis
            width={60}
            tick={{ fontSize: 11, fill: COLORES.textoTenue }}
            tickFormatter={(v) => numero(v)}
            tickLine={false}
            axisLine={false}
            label={{ value: "Mt", position: "insideTopLeft", offset: 0, dy: -8, fontSize: 11, fill: COLORES.textoTenue }}
          />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <CajaTooltip
                  titulo={label}
                  filas={[...payload]
                    .sort((a, b) => b.value - a.value)
                    .map((p) => ({
                      color: p.color,
                      nombre: continentePorClave[p.dataKey]?.nombre ?? p.dataKey,
                      valor: `${numero(p.value)} Mt`,
                    }))}
                />
              ) : null
            }
          />
          {CONTINENTES.map((c) => {
            const atenuada = hayDestacado && c.clave !== continente;
            const subio = serie[ultimo]?.[c.clave] >= serie[0]?.[c.clave];
            return (
              <Line
                key={c.clave}
                dataKey={c.clave}
                stroke={c.hex}
                strokeWidth={c.clave === continente ? 3.5 : 2.5}
                strokeOpacity={atenuada ? 0.25 : 1}
                isAnimationActive={false}
                activeDot={{ r: 4 }}
                dot={(props) => (
                  <Final
                    key={`${c.clave}-${props.index}`}
                    {...props}
                    esUltimo={props.index === ultimo}
                    color={c.hex}
                    texto={`${c.letra} ${subio ? "▲" : "▼"}`}
                    atenuada={atenuada}
                  />
                )}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Tarjeta>
  );
}

function Final({ cx, cy, esUltimo, color, texto, atenuada }) {
  if (!esUltimo || cx == null || cy == null) return <g />;
  return (
    <g opacity={atenuada ? 0.3 : 1}>
      <circle cx={cx} cy={cy} r={4.5} fill={color} stroke="#fff" strokeWidth={2} />
      <text x={cx + 9} y={cy} dy={4} fontSize={11} fontWeight={700} fill={color}>
        {texto}
      </text>
    </g>
  );
}

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFiltros } from "../../context/filtros";
import { COLORES } from "../../lib/colores";
import { nombreAmbito, top5 } from "../../utils/calculos";
import { numero } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import CajaTooltip from "./Tooltip";
import styles from "./GraficoTop5.module.css";

// KPI principal: "¿Quién concentra las emisiones?"
// Izquierda: evolución anual (líneas). Derecha: ranking acumulado 2010–2023.
export default function GraficoTop5({ base }) {
  const filtros = useFiltros();
  const { continente, pais } = filtros;
  const { lista, serie, total } = top5(base, filtros);

  const hayDestacado = lista.some((p) => p.iso3 === pais);
  const maximo = lista[0]?.co2_mt ?? 1;
  const ultimo = serie.length - 1;

  const subtitulo =
    continente === "todos"
      ? "Evolución anual y acumulado de los cinco mayores emisores"
      : `Evolución anual y acumulado de los cinco mayores emisores de ${nombreAmbito(base, { continente, pais: "todos" })}`;

  return (
    <Tarjeta area="top5" titulo="¿Quién concentra las emisiones?" subtitulo={subtitulo} etiqueta="2010–2023">
      <div className={styles.contenido}>
        {/* Gráfico de líneas */}
        <div className={styles.grafico}>
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={serie} margin={{ top: 10, right: 110, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={COLORES.rejilla} />
              <XAxis
                dataKey="anio"
                ticks={[2010, 2015, 2020, 2023]}
                tick={{ fontSize: 11, fill: COLORES.textoTenue }}
                tickLine={false}
                axisLine={{ stroke: COLORES.borde }}
              />
              <YAxis
                width={56}
                tick={{ fontSize: 11, fill: COLORES.textoTenue }}
                tickFormatter={(v) => `${numero(v)}`}
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
                          nombre: base.nombreDe[p.dataKey],
                          valor: `${numero(p.value)} Mt`,
                        }))}
                    />
                  ) : null
                }
              />
              {lista.map((p) => {
                const atenuada = hayDestacado && p.iso3 !== pais;
                const subio = serie[ultimo][p.iso3] >= serie[0][p.iso3];
                return (
                  <Line
                    key={p.iso3}
                    dataKey={p.iso3}
                    name={p.pais}
                    stroke={p.color}
                    strokeWidth={p.iso3 === pais ? 3.5 : 2.5}
                    strokeOpacity={atenuada ? 0.3 : 1}
                    isAnimationActive={false}
                    activeDot={{ r: 4 }}
                    dot={(props) => (
                      <EtiquetaFinal
                        key={`${p.iso3}-${props.index}`}
                        {...props}
                        esUltimo={props.index === ultimo}
                        color={p.color}
                        texto={`${p.pais} ${subio ? "▲" : "▼"}`}
                        atenuada={atenuada}
                      />
                    )}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ranking acumulado */}
        <div className={styles.ranking}>
          <p className={styles.rankingTitulo}>
            Ranking acumulado <span>Mt · 2010–2023</span>
          </p>
          <ol className={styles.lista}>
            {lista.map((p, i) => (
              <li key={p.iso3} className={hayDestacado && p.iso3 !== pais ? styles.atenuado : ""}>
                <div className={styles.filaTexto}>
                  <span>
                    {i + 1}. {p.pais}
                  </span>
                  <strong>{numero(p.co2_mt)} Mt</strong>
                </div>
                <div className={styles.pista}>
                  <div className={styles.barra} style={{ width: `${(p.co2_mt / maximo) * 100}%`, background: p.color }} />
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.total}>
            <span>Total top 5</span>
            <strong>{numero(total)} Mt</strong>
          </div>
        </div>
      </div>
    </Tarjeta>
  );
}

// Punto y nombre del país al final de cada línea (solo en 2023)
function EtiquetaFinal({ cx, cy, esUltimo, color, texto, atenuada }) {
  if (!esUltimo || cx == null || cy == null) return <g />;
  return (
    <g opacity={atenuada ? 0.35 : 1}>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
      <text x={cx + 10} y={cy} dy={4} fontSize={12} fontWeight={600} fill={color}>
        {texto}
      </text>
    </g>
  );
}

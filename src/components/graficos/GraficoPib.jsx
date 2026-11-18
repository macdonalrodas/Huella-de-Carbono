import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { useFiltros } from "../../context/FiltrosContext";
import { COLORES } from "../../lib/colores";
import { CONTINENTES, continentePorClave } from "../../lib/continentes";
import { datosDispersion } from "../../utils/calculos";
import { numero, poblacion } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import CajaTooltip from "./Tooltip";
import styles from "./GraficoPib.module.css";

const POB_MAX = 1.45e9; // ~ población de China/India, para escalar burbujas
const radio = (pob) => 3 + 25 * Math.sqrt(pob / POB_MAX);

const TICKS_X = [1000, 3000, 10000, 30000, 100000];
const TICKS_Y = [0.1, 0.3, 1, 3, 10, 30];
const formatoX = (v) => (v >= 1000 ? `${numero(v / 1000)}k` : numero(v));

// "PIB y emisiones": dispersión log-log, burbuja = país, tamaño = población
export default function GraficoPib({ base }) {
  const filtros = useFiltros();
  const { anio } = filtros;
  const { puntos, linea, mundo, intensidadMundial } = datosDispersion(base, anio, filtros);

  // Una serie por continente (para colores). Las burbujas grandes se dibujan primero.
  const series = [
    ...CONTINENTES.map((c) => ({ ...c, datos: puntos.filter((p) => p.continente === c.clave) })),
    { clave: "otros", nombre: "Sin continente", hex: COLORES.textoTenue, datos: puntos.filter((p) => !continentePorClave[p.continente]) },
  ].map((s) => ({ ...s, datos: [...s.datos].sort((a, b) => b.poblacion - a.poblacion) }));

  return (
    <Tarjeta area="pib" titulo="PIB y emisiones" subtitulo="PIB per cápita vs. CO₂ per cápita · escala logarítmica" etiqueta={anio}>
      <div className={styles.leyenda}>
        {CONTINENTES.map((c) => (
          <span key={c.clave}>
            <i style={{ background: c.hex }}>{c.letra}</i>
            {c.nombre}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 24, right: 24, bottom: 24, left: 8 }}>
          <CartesianGrid stroke={COLORES.rejilla} />
          <XAxis
            type="number"
            dataKey="x"
            scale="log"
            domain={[500, 200000]}
            ticks={TICKS_X}
            tickFormatter={formatoX}
            tick={{ fontSize: 10, fill: COLORES.textoTenue }}
            tickLine={false}
            axisLine={{ stroke: COLORES.borde }}
            allowDataOverflow
            label={{ value: "PIB per cápita (dólares internacionales de 2021, PPA, log)", position: "bottom", offset: 6, fontSize: 11, fill: COLORES.texto }}
          />
          <YAxis
            type="number"
            dataKey="y"
            scale="log"
            domain={[0.02, 80]}
            ticks={TICKS_Y}
            tickFormatter={(v) => numero(v, v < 1 ? 1 : 0)}
            tick={{ fontSize: 10, fill: COLORES.textoTenue }}
            tickLine={false}
            axisLine={false}
            width={44}
            allowDataOverflow
            label={{ value: "CO₂ per cápita (t/hab, log)", angle: -90, position: "insideLeft", offset: 4, dy: 70, fontSize: 11, fill: COLORES.texto }}
          />
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload;
              if (p.esMundo) {
                return (
                  <CajaTooltip
                    titulo="Mundo"
                    filas={[
                      { nombre: "PIB per cápita", valor: `US$ ${numero(p.x)}` },
                      { nombre: "Intensidad", valor: `${numero(p.intensidad, 2)} kg/US$` },
                    ]}
                    nota="Promedio de los países con datos de PIB"
                  />
                );
              }
              if (!p.iso3) return null;
              return (
                <CajaTooltip
                  titulo={p.pais}
                  filas={[
                    { color: continentePorClave[p.continente]?.hex, nombre: "Continente", valor: continentePorClave[p.continente]?.nombre ?? "—" },
                    { nombre: "PIB per cápita", valor: `US$ ${numero(p.x)}` },
                    { nombre: "CO₂ per cápita", valor: `${numero(p.y, 1)} t/hab` },
                    { nombre: "Intensidad", valor: `${numero(p.intensidad, 2)} kg/US$` },
                    { nombre: "Población", valor: poblacion(p.poblacion) },
                  ]}
                />
              );
            }}
          />

          {/* Línea de intensidad promedio mundial: mismos kg/US$ que la tarjeta KPI */}
          <Scatter
            data={linea}
            line={{ stroke: COLORES.verdeBosque, strokeWidth: 1.5, strokeDasharray: "6 5" }}
            shape={() => <g />}
            isAnimationActive={false}
            legendType="none"
            tooltipType="none"
          />

          {series.map((s) => (
            <Scatter
              key={s.clave}
              data={s.datos}
              isAnimationActive={false}
              shape={(props) => <Burbuja {...props} color={s.hex} letra={s.letra} />}
            />
          ))}

          <Scatter data={[{ ...mundo, esMundo: true }]} isAnimationActive={false} shape={(props) => <PuntoMundo {...props} />} />
        </ScatterChart>
      </ResponsiveContainer>

      <div className={styles.pie}>
        <span>Burbuja = país · Tamaño = población · Línea punteada = intensidad promedio mundial ({numero(intensidadMundial, 2)} kg CO₂/US$)</span>
        <span>La correlación no implica causalidad</span>
      </div>
    </Tarjeta>
  );
}

function Burbuja({ cx, cy, payload, color, letra }) {
  if (cx == null || cy == null) return <g />;
  const r = radio(payload.poblacion);
  const opacidad = payload.atenuado ? 0.12 : 0.78;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        fillOpacity={opacidad}
        stroke={payload.destacado ? COLORES.texto : "#fff"}
        strokeWidth={payload.destacado ? 2.5 : 1}
      />
      {r >= 11 && !payload.atenuado && letra && (
        <text x={cx} y={cy} dy={3.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" pointerEvents="none">
          {letra}
        </text>
      )}
      {payload.destacado && (
        <text x={cx + r + 6} y={cy} dy={4} fontSize={12} fontWeight={700} fill={COLORES.texto} pointerEvents="none">
          {payload.pais}
        </text>
      )}
    </g>
  );
}

function PuntoMundo({ cx, cy }) {
  if (cx == null || cy == null) return <g />;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="#fff" stroke={COLORES.verdeBosque} strokeWidth={2.5} />
      <text x={cx + 10} y={cy + 16} fontSize={11} fontWeight={700} fill={COLORES.verdeBosque}>
        Mundo
      </text>
    </g>
  );
}

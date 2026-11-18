import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFiltros } from "../../context/filtros";
import { COLORES } from "../../lib/colores";
import { datosSectores, nombreAmbito } from "../../utils/calculos";
import { GRUPOS_SECTOR } from "../../utils/config";
import { numero } from "../../utils/formato";
import Tarjeta from "../layout/Tarjeta";
import CajaTooltip from "./Tooltip";
import styles from "./GraficoSectores.module.css";

// "Contribución por sector": barras apiladas al 100 % (2010, 2016, 2023)
export default function GraficoSectores({ base }) {
  const filtros = useFiltros();
  const datos = datosSectores(base, filtros);
  const ambito = nombreAmbito(base, filtros);
  const subtitulo =
    ambito === "Mundo" ? "Participación en emisiones globales" : `Participación en las emisiones de ${ambito}`;

  return (
    <Tarjeta area="sectores" titulo="Contribución por sector" subtitulo={subtitulo}>
      {datos.length === 0 ? (
        <p className={styles.vacio}>No hay datos por sector para {ambito}.</p>
      ) : (
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 4, bottom: 4, left: 0 }} barCategoryGap={22}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="anio"
              width={44}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fontWeight: 600, fill: COLORES.texto }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <CajaTooltip
                    titulo={label}
                    filas={GRUPOS_SECTOR.map((g) => ({
                      color: g.color,
                      nombre: g.nombre,
                      valor: `${numero(payload[0].payload[g.clave], 1)} % · ${numero(payload[0].payload[`${g.clave}Mt`])} Mt`,
                    }))}
                    nota={`Total de estos sectores: ${numero(payload[0].payload.totalMt)} Mt`}
                  />
                ) : null
              }
            />
            {GRUPOS_SECTOR.map((g, i) => (
              <Bar key={g.clave} dataKey={g.clave} stackId="sectores" fill={g.color} isAnimationActive={false}>
                <LabelList
                  dataKey={g.clave}
                  position="center"
                  formatter={(v) => (v >= 6 ? `${numero(v, 0)} %` : "")}
                  fill={i === 0 ? "#fff" : COLORES.texto}
                  fontSize={11}
                  fontWeight={700}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}

      <div className={styles.leyenda}>
        {GRUPOS_SECTOR.map((g) => (
          <span key={g.clave}>
            <i style={{ background: g.color }} /> {g.nombre}
          </span>
        ))}
      </div>
      <p className={styles.nota}>Barras apiladas al 100 % · Porcentaje del total anual</p>
    </Tarjeta>
  );
}

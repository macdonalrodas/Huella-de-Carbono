import { useFiltros } from "../../context/filtros";
import {
  intensidad,
  kpiAnual,
  mayorMejora,
  nombreAmbito,
  perCapita,
  top5,
  variacionAmbito,
} from "../../utils/calculos";
import { numero, porcentaje } from "../../utils/formato";
import { IconoBarras, IconoHoja, IconoMedidor, IconoPersona, IconoTendencia } from "./Iconos";
import TarjetaKpi from "./TarjetaKpi";
import styles from "./FilaKpis.module.css";

// Insignia de cambio: azul si baja (mejora), naranja si sube
const insigniaCambio = (cambio) => {
  if (cambio == null) return null;
  if (Math.abs(cambio) < 0.05) return { texto: "0.0 %", tono: "neutro" };
  return cambio < 0
    ? { texto: `▼ ${porcentaje(cambio)}`, tono: "reduccion" }
    : { texto: `▲ ${porcentaje(cambio)}`, tono: "aumento" };
};

export default function FilaKpis({ base }) {
  const filtros = useFiltros();
  const { anio, continente, pais } = filtros;

  const ambito = nombreAmbito(base, filtros);
  const esMundo = continente === "todos" && pais === "todos";
  const textoAmbito = esMundo ? "Promedio mundial" : pais !== "todos" ? ambito : `Promedio de ${ambito}`;

  const principal = top5(base, filtros);
  const pc = kpiAnual(base, perCapita, anio, filtros);
  const variacion = variacionAmbito(base, filtros);
  const mejora = mayorMejora(base, filtros);
  const intens = kpiAnual(base, intensidad, anio, filtros);

  return (
    <div className={styles.fila}>
      <TarjetaKpi
        principal
        icono={<IconoBarras />}
        etiqueta="Total de emisiones de CO₂ por país"
        valor={numero(principal.total)}
        unidad="Mt"
        detalle={`Top 5 emisores${continente !== "todos" ? ` de ${nombreAmbito(base, { continente, pais: "todos" })}` : ""} · Acumulado 2010–2023`}
        insignia={{ texto: "2010–2023", tono: "principal" }}
      />

      <TarjetaKpi
        icono={<IconoPersona />}
        etiqueta="CO₂ per cápita"
        valor={numero(pc.valor, 1)}
        unidad="t/hab"
        detalle={`${textoAmbito} · ${anio} · cambio vs. 2010`}
        insignia={insigniaCambio(pc.cambio)}
      />

      <TarjetaKpi
        icono={<IconoTendencia />}
        etiqueta="Variación 2010–2023"
        valor={porcentaje(variacion.valor)}
        detalle={`Emisiones ${esMundo ? "mundiales" : `de ${ambito}`}`}
        insignia={
          variacion.valor == null
            ? null
            : variacion.valor >= 0
              ? { texto: "Aumento", tono: "aumento" }
              : { texto: "Reducción", tono: "reduccion" }
        }
      />

      <TarjetaKpi
        icono={<IconoHoja />}
        etiqueta="Mayor mejora ambiental"
        valor={mejora ? mejora.pais : "Sin reducciones"}
        detalle={
          mejora
            ? "Emisiones totales · 2010–2023"
            : "Ningún país ≥ 50 Mt redujo emisiones"
        }
        insignia={mejora ? insigniaCambio(mejora.variacionTotal) : null}
      />

      <TarjetaKpi
        icono={<IconoMedidor />}
        etiqueta="Intensidad de carbono"
        valor={numero(intens.valor, 2)}
        unidad="kg CO₂/US$"
        detalle={`${textoAmbito} · ${anio} · cambio vs. 2010`}
        insignia={insigniaCambio(intens.cambio)}
      />
    </div>
  );
}

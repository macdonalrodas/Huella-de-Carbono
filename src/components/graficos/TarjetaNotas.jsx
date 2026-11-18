import { EXCLUIDOS_MEJORA, UMBRAL_MT } from "../../utils/config";
import Tarjeta from "../layout/Tarjeta";
import styles from "./TarjetaNotas.module.css";

// "Notas y cobertura": decisiones de procesamiento visibles para el usuario
export default function TarjetaNotas({ base }) {
  const sinPib = new Set(base.maestro.filter((f) => f.pib_pc_usd == null).map((f) => f.iso3)).size;
  const excluidos = EXCLUIDOS_MEJORA.map((iso) => base.nombreDe[iso] ?? iso).join(", ");

  const notas = [
    "Emisiones territoriales de CO₂ (producidas dentro de cada país; no incluyen las importadas en bienes).",
    "Periodo 2010–2023. Los totales mundiales incluyen la aviación y la navegación internacionales.",
    `Datos faltantes sin imputar: ${sinPib} países tienen años sin PIB y no aparecen en la dispersión ni en la intensidad de esos años.`,
    `Mayor mejora: países con al menos ${UMBRAL_MT} Mt en 2010; se excluyen ${excluidos} porque su caída se debe a guerras o crisis económicas.`,
    "PIB per cápita en dólares internacionales de 2021, ajustados por paridad de poder adquisitivo (PPA).",
    "Sectores: se excluye el cambio de uso de suelo (puede ser negativo); su total puede diferir ligeramente del total anual.",
    "Temperatura: anomalía global respecto a 1861–1890 (HadCRUT5, Met Office).",
  ];

  return (
    <Tarjeta titulo="Notas y cobertura">
      <ul className={styles.lista}>
        {notas.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </Tarjeta>
  );
}

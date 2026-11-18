import styles from "./TarjetaKpi.module.css";

// Tarjeta de un KPI.
// insignia: { texto, tono } con tono "aumento" | "reduccion" | "neutro" | "principal"
export default function TarjetaKpi({ icono, etiqueta, valor, unidad, detalle, insignia, principal = false }) {
  return (
    <article className={`${styles.kpi} ${principal ? styles.principal : ""}`}>
      <div className={styles.superior}>
        <span className={styles.icono}>{icono}</span>
        {insignia && <span className={`${styles.insignia} ${styles[insignia.tono]}`}>{insignia.texto}</span>}
      </div>

      <p className={styles.etiqueta}>{etiqueta}</p>
      <p className={styles.valor}>
        {valor}
        {unidad && <span className={styles.unidad}> {unidad}</span>}
      </p>
      {detalle && <p className={styles.detalle}>{detalle}</p>}
    </article>
  );
}

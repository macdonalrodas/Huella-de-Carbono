import styles from "./Tooltip.module.css";

// Caja de tooltip común para todos los gráficos.
// filas: [{ color, nombre, valor }]
export default function CajaTooltip({ titulo, filas = [], nota }) {
  return (
    <div className={styles.caja}>
      {titulo && <p className={styles.titulo}>{titulo}</p>}
      {filas.map((f) => (
        <div key={f.nombre} className={styles.fila}>
          {f.color && <span className={styles.punto} style={{ background: f.color }} />}
          <span className={styles.nombre}>{f.nombre}</span>
          <span className={styles.valor}>{f.valor}</span>
        </div>
      ))}
      {nota && <p className={styles.nota}>{nota}</p>}
    </div>
  );
}

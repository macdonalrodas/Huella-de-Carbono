import styles from "./Tarjeta.module.css";

// Contenedor común de cada gráfico: título, subtítulo, etiqueta y contenido.
// "accion" permite poner un control a la derecha (por ejemplo, un selector).
export default function Tarjeta({ titulo, subtitulo, etiqueta, accion, area, children }) {
  return (
    <section className={styles.tarjeta} style={area ? { gridArea: area } : undefined}>
      <div className={styles.encabezado}>
        <div>
          <h2 className={styles.titulo}>{titulo}</h2>
          {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
        </div>
        {accion ?? (etiqueta && <span className={styles.etiqueta}>{etiqueta}</span>)}
      </div>
      <div className={styles.cuerpo}>{children}</div>
    </section>
  );
}

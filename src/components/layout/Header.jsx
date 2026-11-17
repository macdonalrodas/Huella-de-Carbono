import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.contenido}>
        <div>
          <h1 className={styles.titulo}>Huella de carbono: ¿quién contamina más?</h1>
          <p className={styles.subtitulo}>
            Emisiones de CO₂ por país frente a PIB y población · 2010–2023
          </p>
        </div>
        <div className={styles.fuente}>
          <span className={styles.fuenteEtiqueta}>Fuente</span>
          <a href="https://ourworldindata.org/co2-emissions" target="_blank" rel="noreferrer">
            Our World in Data
          </a>
        </div>
      </div>
    </header>
  );
}

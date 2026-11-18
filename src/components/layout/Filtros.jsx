import { ANIOS, useFiltros } from "../../context/filtros";
import { CONTINENTES } from "../../lib/continentes";
import styles from "./Filtros.module.css";

// paises: lista [{ iso3, pais, continente }] ya ordenada y con nombres en español
export default function Filtros({ paises = [] }) {
  const { anio, setAnio, continente, setContinente, pais, setPais, restablecer } = useFiltros();

  // El selector de país solo muestra los países del continente elegido
  const opcionesPais = paises.filter((p) => continente === "todos" || p.continente === continente);

  return (
    <div className={styles.barra}>
      <div className={styles.contenido}>
        <div className={styles.grupo}>
          <Selector etiqueta="Año" valor={anio} onCambio={(v) => setAnio(Number(v))}>
            {ANIOS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </Selector>

          <Selector etiqueta="Continente" valor={continente} onCambio={setContinente} ancho>
            <option value="todos">Todos los continentes</option>
            {CONTINENTES.map((c) => (
              <option key={c.clave} value={c.clave}>{c.nombre}</option>
            ))}
          </Selector>

          <Selector etiqueta="País" valor={pais} onCambio={setPais} ancho>
            <option value="todos">Todos los países</option>
            {opcionesPais.map((p) => (
              <option key={p.iso3} value={p.iso3}>{p.pais}</option>
            ))}
          </Selector>

          <button type="button" className={styles.restablecer} onClick={restablecer}>
            <span aria-hidden="true">↻</span> Restablecer filtros
          </button>
        </div>

        <span className={styles.insignia}>
          <span className={styles.punto} /> KPI principal: periodo 2010–2023
        </span>
      </div>
    </div>
  );
}

function Selector({ etiqueta, valor, onCambio, ancho, children }) {
  return (
    <label className={`${styles.selector} ${ancho ? styles.ancho : ""}`}>
      <span className={styles.etiqueta}>{etiqueta}</span>
      <select value={valor} onChange={(e) => onCambio(e.target.value)}>
        {children}
      </select>
    </label>
  );
}

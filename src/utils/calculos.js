// =========================================================
// Cálculos del dashboard
// ---------------------------------------------------------
// TODOS los números que se muestran salen de este archivo.
// Así un mismo indicador (por ejemplo, el promedio mundial
// per cápita) se calcula una sola vez y se lee igual en
// cualquier tarjeta o gráfico donde aparezca.
//
// Definiciones usadas:
// · Total mundial = entidad "World" de OWID (incluye aviación
//   y navegación internacional).
// · Per cápita del ámbito = emisiones del ámbito / población
//   del ámbito (mundo: total mundial / suma de población de
//   los países).
// · Intensidad de carbono = kg de CO2 / US$ de PIB, con los
//   países que tienen PIB, población y emisiones.
// =========================================================
import { continentePorClave } from "../lib/continentes";
import { nombreEnEspanol } from "./nombres";
import {
  ANIO_FIN,
  ANIO_INI,
  ANIOS_SECTORES,
  COLORES_TOP5,
  CORTES_MAPA,
  EXCLUIDOS_MEJORA,
  GRUPOS_SECTOR,
} from "./config";

const suma = (arr, f) => arr.reduce((acc, x) => acc + (f(x) ?? 0), 0);
const cambioPct = (inicio, fin) =>
  inicio == null || fin == null || inicio === 0 ? null : ((fin - inicio) / inicio) * 100;

// ---------------------------------------------------------
// 1. Preparación: índices para buscar rápido
// ---------------------------------------------------------
export function prepararBase(datos) {
  const continenteDe = Object.fromEntries(datos.paises.map((p) => [p.iso3, p.continente]));

  // Nombres de países en español (los datos de OWID vienen en inglés)
  const paises = datos.paises
    .map((p) => ({ ...p, pais: nombreEnEspanol(p.iso3, p.pais) }))
    .sort((a, b) => a.pais.localeCompare(b.pais, "es"));
  const nombreDe = Object.fromEntries(paises.map((p) => [p.iso3, p.pais]));

  const maestro = datos.maestro.map((f) => ({
    ...f,
    pais: nombreDe[f.iso3] ?? f.pais,
    continente: continenteDe[f.iso3] ?? null,
  }));

  const porAnio = {};
  const porPais = {};
  for (const f of maestro) {
    (porAnio[f.anio] ??= []).push(f);
    (porPais[f.iso3] ??= []).push(f);
  }
  Object.values(porPais).forEach((filas) => filas.sort((a, b) => a.anio - b.anio));

  // Regiones: { anio: { World: Mt, Africa: Mt, ... } }
  const regionPorAnio = {};
  for (const r of datos.regiones) (regionPorAnio[r.anio] ??= {})[r.region] = r.co2_mt;

  // Población mundial por año (suma de los países)
  const poblacionMundial = {};
  for (const [anio, filas] of Object.entries(porAnio)) {
    poblacionMundial[anio] = suma(filas, (f) => f.poblacion);
  }

  const variacion = datos.variacion.map((v) => ({
    ...v,
    pais: nombreDe[v.iso3] ?? v.pais,
    continente: continenteDe[v.iso3] ?? null,
  }));

  return {
    datos,
    paises,
    nombreDe,
    maestro,
    porAnio,
    porPais,
    regionPorAnio,
    poblacionMundial,
    continenteDe,
    variacion,
  };
}

// Nombre legible del ámbito activo
export function nombreAmbito(base, { continente, pais }) {
  if (pais !== "todos") return base.nombreDe[pais] ?? pais;
  if (continente !== "todos") return continentePorClave[continente]?.nombre ?? continente;
  return "Mundo";
}

const filaPais = (base, iso3, anio) => base.porPais[iso3]?.find((f) => f.anio === anio) ?? null;

const filasContinente = (base, anio, continente) =>
  (base.porAnio[anio] ?? []).filter((f) => continente === "todos" || f.continente === continente);

// ---------------------------------------------------------
// 2. Indicadores por ámbito (mundo, continente o país)
// ---------------------------------------------------------

// CO2 per cápita (t/hab)
export function perCapita(base, anio, { continente, pais }) {
  if (pais !== "todos") return filaPais(base, pais, anio)?.co2_pc_t ?? null;
  if (continente !== "todos") {
    const filas = filasContinente(base, anio, continente).filter((f) => f.poblacion);
    return suma(filas, (f) => f.co2_t) / suma(filas, (f) => f.poblacion);
  }
  const totalMt = base.regionPorAnio[anio]?.World;
  return totalMt == null ? null : (totalMt * 1e6) / base.poblacionMundial[anio];
}

// Intensidad de carbono (kg CO2 / US$)
export function intensidad(base, anio, { continente, pais }) {
  if (pais !== "todos") return filaPais(base, pais, anio)?.intensidad_kg_usd ?? null;
  const filas = filasContinente(base, anio, continente).filter((f) => f.pib_pc_usd && f.poblacion);
  const pib = suma(filas, (f) => f.pib_pc_usd * f.poblacion);
  return pib ? (suma(filas, (f) => f.co2_t) * 1000) / pib : null;
}

// Emisiones totales (Mt) del ámbito en un año
export function emisionesTotales(base, anio, { continente, pais }) {
  if (pais !== "todos") return filaPais(base, pais, anio)?.co2_mt ?? null;
  const clave = continente === "todos" ? "World" : continente;
  return base.regionPorAnio[anio]?.[clave] ?? null;
}

// ---------------------------------------------------------
// 3. KPIs de las tarjetas
// ---------------------------------------------------------

// Ranking por emisiones acumuladas 2010–2023: [[iso3, Mt], ...] de mayor a menor
function rankingAcumulado(base, continente) {
  const acumulado = {};
  for (const f of base.maestro) {
    if (continente !== "todos" && f.continente !== continente) continue;
    acumulado[f.iso3] = (acumulado[f.iso3] ?? 0) + f.co2_mt;
  }
  return Object.entries(acumulado).sort((a, b) => b[1] - a[1]);
}

// KPI principal: 5 mayores emisores acumulados 2010–2023
export function top5(base, { continente }) {
  const lista = rankingAcumulado(base, continente)
    .slice(0, 5)
    .map(([iso3, co2_mt], i) => ({ iso3, pais: base.nombreDe[iso3], co2_mt, color: COLORES_TOP5[i] }));

  const serie = [];
  for (let anio = ANIO_INI; anio <= ANIO_FIN; anio++) {
    const punto = { anio };
    for (const p of lista) punto[p.iso3] = filaPais(base, p.iso3, anio)?.co2_mt ?? null;
    serie.push(punto);
  }
  return { lista, serie, total: suma(lista, (p) => p.co2_mt) };
}

// Tarjeta: valor del año y cambio respecto a 2010
export function kpiAnual(base, fn, anio, filtros) {
  const valor = fn(base, anio, filtros);
  const inicio = fn(base, ANIO_INI, filtros);
  return { valor, cambio: anio === ANIO_INI ? 0 : cambioPct(inicio, valor) };
}

// Variación de emisiones 2010–2023 del ámbito
export function variacionAmbito(base, filtros) {
  const inicio = emisionesTotales(base, ANIO_INI, filtros);
  const fin = emisionesTotales(base, ANIO_FIN, filtros);
  return { inicio, fin, valor: cambioPct(inicio, fin) };
}

// Mayor mejora ambiental: mayor reducción de emisiones totales 2010–2023
// entre países con ≥ 50 Mt en 2010, sin los excluidos.
export function mayorMejora(base, { continente }) {
  const candidatos = base.variacion
    .filter((v) => !EXCLUIDOS_MEJORA.includes(v.iso3))
    .filter((v) => continente === "todos" || v.continente === continente)
    .sort((a, b) => a.variacion_pct - b.variacion_pct);

  const mejor = candidatos[0];
  if (!mejor || mejor.variacion_pct >= 0) return null; // ningún país redujo emisiones

  const sinFiltro = { continente: "todos", pais: "todos" };
  const serie = (base.porPais[mejor.iso3] ?? []).map((f) => ({
    anio: f.anio,
    pais: f.co2_pc_t,
    mundo: perCapita(base, f.anio, sinFiltro),
  }));
  const pcInicio = serie[0]?.pais;
  const pcFin = serie[serie.length - 1]?.pais;

  return {
    iso3: mejor.iso3,
    pais: mejor.pais, // ya en español
    variacionTotal: mejor.variacion_pct,
    co2InicioMt: mejor.co2_inicio_mt,
    co2FinMt: mejor.co2_fin_mt,
    serie,
    pcInicio,
    pcFin,
    variacionPerCapita: cambioPct(pcInicio, pcFin),
  };
}

// ---------------------------------------------------------
// 4. Datos de cada gráfico
// ---------------------------------------------------------

// Mapa: clase (1–5) según los cortes de config.js
export const claseMapa = (valor) => {
  if (valor == null) return 0; // sin datos
  const i = CORTES_MAPA.findIndex((c) => valor < c);
  return i === -1 ? 5 : i + 1;
};

export function datosMapa(base, anio) {
  const valores = {};
  for (const f of base.porAnio[anio] ?? []) valores[f.iso3] = f;
  return valores; // { iso3: fila del maestro }
}

// Variación por país (barras divergentes)
export const MODOS_VARIACION = [
  { clave: "top10", nombre: "Top 10 emisores" },
  { clave: "top20", nombre: "Top 20 emisores" },
  { clave: "reducciones", nombre: "Mayores reducciones" },
  { clave: "aumentos", nombre: "Mayores aumentos" },
];

export function datosVariacion(base, modo, { continente, pais }) {
  const enAmbito = base.variacion.filter((v) => continente === "todos" || v.continente === continente);
  let lista;

  if (modo === "top10" || modo === "top20") {
    const n = modo === "top10" ? 10 : 20;
    const orden = rankingAcumulado(base, continente).map(([iso3]) => iso3);
    const porIso = Object.fromEntries(enAmbito.map((v) => [v.iso3, v]));
    lista = orden.filter((iso) => porIso[iso]).slice(0, n).map((iso) => porIso[iso]);
  } else if (modo === "reducciones") {
    lista = enAmbito.filter((v) => v.variacion_pct < 0).sort((a, b) => a.variacion_pct - b.variacion_pct).slice(0, 10);
  } else {
    lista = enAmbito.filter((v) => v.variacion_pct > 0).sort((a, b) => b.variacion_pct - a.variacion_pct).slice(0, 10);
  }

  lista = lista.map((v) => ({ ...v, seleccionado: v.iso3 === pais }));

  // Si hay un país seleccionado que no está en la lista, se agrega al final
  if (pais !== "todos" && !lista.some((v) => v.iso3 === pais)) {
    const inicio = filaPais(base, pais, ANIO_INI)?.co2_mt;
    const fin = filaPais(base, pais, ANIO_FIN)?.co2_mt;
    const valor = cambioPct(inicio, fin);
    if (valor != null) {
      lista.push({
        iso3: pais,
        pais: base.nombreDe[pais],
        co2_inicio_mt: inicio,
        co2_fin_mt: fin,
        variacion_pct: valor,
        seleccionado: true,
        agregado: true,
      });
    }
  }

  // Orden visual: de mayor aumento a mayor reducción
  return lista.sort((a, b) => b.variacion_pct - a.variacion_pct);
}

// Dispersión PIB per cápita vs CO2 per cápita
export function datosDispersion(base, anio, { continente, pais }) {
  const filas = (base.porAnio[anio] ?? []).filter((f) => f.pib_pc_usd && f.co2_pc_t && f.poblacion);

  const puntos = filas.map((f) => ({
    iso3: f.iso3,
    pais: f.pais,
    continente: f.continente,
    x: f.pib_pc_usd,
    y: f.co2_pc_t,
    poblacion: f.poblacion,
    intensidad: f.intensidad_kg_usd,
    atenuado: continente !== "todos" && f.continente !== continente,
    destacado: f.iso3 === pais,
  }));

  // Línea de intensidad promedio mundial: CO2 pc = I × PIB pc / 1000
  const sinFiltro = { continente: "todos", pais: "todos" };
  const I = intensidad(base, anio, sinFiltro);
  const pibMundial = suma(filas, (f) => f.pib_pc_usd * f.poblacion) / suma(filas, (f) => f.poblacion);
  const xs = puntos.map((p) => p.x);
  const [xMin, xMax] = [Math.min(...xs), Math.max(...xs)];
  const linea = [xMin * 0.8, xMax * 1.2].map((x) => ({ x, y: (I * x) / 1000 }));
  const mundo = { x: pibMundial, y: (I * pibMundial) / 1000, intensidad: I };

  return { puntos, linea, mundo, intensidadMundial: I };
}

// Emisiones por continente (líneas)
export function datosContinentes(base) {
  const serie = [];
  for (let anio = ANIO_INI; anio <= ANIO_FIN; anio++) {
    const fila = { anio, ...(base.regionPorAnio[anio] ?? {}) };
    delete fila.World; // el total mundial no es un continente
    serie.push(fila);
  }
  return serie;
}

// Contribución por sector (barras apiladas al 100 %)
export function datosSectores(base, { continente, pais }) {
  const filas = base.datos.sectores;

  return ANIOS_SECTORES.map((anio) => {
    let fuente;
    if (pais !== "todos") fuente = filas.filter((f) => f.iso3 === pais && f.anio === anio);
    else if (continente !== "todos")
      fuente = filas.filter((f) => f.anio === anio && base.continenteDe[f.iso3] === continente);
    else fuente = filas.filter((f) => f.pais === "World" && f.anio === anio);

    const valores = Object.fromEntries(
      GRUPOS_SECTOR.map((g) => [g.clave, suma(fuente, (f) => suma(g.columnas, (c) => f[c]))])
    );
    const total = suma(Object.values(valores), (v) => v);
    const punto = { anio: String(anio), totalMt: total };
    for (const g of GRUPOS_SECTOR) {
      punto[g.clave] = total ? (valores[g.clave] / total) * 100 : null;
      punto[`${g.clave}Mt`] = valores[g.clave];
    }
    return punto;
  }).filter((p) => p.totalMt > 0);
}

// Temperatura global
export function datosTemperatura(base, anio) {
  const serie = [...base.datos.temperatura].sort((a, b) => a.anio - b.anio);
  const valorDe = (a) => serie.find((t) => t.anio === a)?.anomalia_c ?? null;
  const valor = valorDe(anio);
  return { serie, valor, cambioDesde2010: valor == null ? null : valor - valorDe(ANIO_INI) };
}

// ---------------------------------------------------------
// 5. Verificación de consistencia con los KPIs de Colab
//    (tabla kpi_resumen). Si algo no coincide, avisa en la
//    consola del navegador.
// ---------------------------------------------------------
export function verificarConsistencia(base) {
  const sinFiltro = { continente: "todos", pais: "todos" };
  const resumen = base.datos.resumen;
  const avisos = [];

  const t5 = top5(base, sinFiltro).lista;
  resumen
    .filter((r) => r.tipo === "top5")
    .forEach((r) => {
      const calc = t5[r.orden - 1];
      if (!calc || calc.iso3 !== r.iso3 || Math.abs(calc.co2_mt - r.valor) > 1)
        avisos.push(`Top 5 posición ${r.orden}: Colab=${r.iso3} ${r.valor}, React=${calc?.iso3} ${calc?.co2_mt}`);
    });

  const mm = mayorMejora(base, sinFiltro);
  const rm = resumen.find((r) => r.tipo === "mayor_mejora");
  if (rm && (mm?.iso3 !== rm.iso3 || Math.abs(mm.variacionTotal - rm.valor) > 0.05))
    avisos.push(`Mayor mejora: Colab=${rm.iso3} ${rm.valor}, React=${mm?.iso3} ${mm?.variacionTotal}`);

  if (avisos.length) console.warn("⚠ Diferencias con kpi_resumen:", avisos);
  else console.info("✔ KPIs consistentes con kpi_resumen (Colab)");
  return avisos;
}

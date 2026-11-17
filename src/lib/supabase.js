import { createClient } from "@supabase/supabase-js";

// Cliente de Supabase con las variables de .env.local
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Supabase devuelve como máximo 1000 filas por consulta.
// Esta función pide los datos por bloques hasta traer la tabla completa
// (co2_maestro tiene 3010 filas y sectores 2716).
export async function traerTabla(tabla, columnas = "*") {
  const BLOQUE = 1000;
  let filas = [];
  for (let desde = 0; ; desde += BLOQUE) {
    const { data, error } = await supabase
      .from(tabla)
      .select(columnas)
      .range(desde, desde + BLOQUE - 1);
    if (error) throw error;
    filas = filas.concat(data);
    if (data.length < BLOQUE) break;
  }
  return filas;
}
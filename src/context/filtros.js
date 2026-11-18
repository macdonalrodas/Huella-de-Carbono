import { createContext, useContext } from "react";

// Valores iniciales de los filtros globales
export const ANIO_INICIAL = 2023;
export const ANIOS = Array.from({ length: 14 }, (_, i) => 2010 + i); // 2010–2023

// Contexto compartido por todos los componentes del dashboard.
// (Está separado de FiltrosContext.jsx para que ese archivo solo
// exporte componentes, como pide el "fast refresh" de Vite.)
export const FiltrosContext = createContext(null);

export function useFiltros() {
  return useContext(FiltrosContext);
}

import { createContext, useContext, useState } from "react";

// Valores iniciales de los filtros globales
export const ANIO_INICIAL = 2023;
export const ANIOS = Array.from({ length: 14 }, (_, i) => 2010 + i); // 2010–2023

const FiltrosContext = createContext(null);

export function FiltrosProvider({ children }) {
  const [anio, setAnio] = useState(ANIO_INICIAL);
  const [continente, setContinente] = useState("todos");
  const [pais, setPais] = useState("todos"); // guarda el iso3 del país

  const restablecer = () => {
    setAnio(ANIO_INICIAL);
    setContinente("todos");
    setPais("todos");
  };

  // Al cambiar de continente se limpia el país, para no dejar
  // seleccionado un país que no pertenece al continente nuevo
  const cambiarContinente = (valor) => {
    setContinente(valor);
    setPais("todos");
  };

  return (
    <FiltrosContext.Provider
      value={{ anio, setAnio, continente, setContinente: cambiarContinente, pais, setPais, restablecer }}
    >
      {children}
    </FiltrosContext.Provider>
  );
}

export function useFiltros() {
  return useContext(FiltrosContext);
}

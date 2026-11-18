import { useState } from "react";
import { ANIO_INICIAL, FiltrosContext } from "./filtros";

// Proveedor de los filtros globales: año, continente y país
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

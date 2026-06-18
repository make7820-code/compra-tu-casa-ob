"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const PropiedadesContext = createContext();

export function PropiedadesProvider({ children }) {
  // Intentamos cargar lo que ya existía, o empezamos vacío
  const [propiedades, setPropiedades] = useState(() => {
    if (typeof window !== "undefined") {
      const guardado = localStorage.getItem('misPropiedades');
      return guardado ? JSON.parse(guardado) : [];
    }
    return [];
  });

  // Cada vez que 'propiedades' cambia, se guarda en el navegador
  useEffect(() => {
    localStorage.setItem('misPropiedades', JSON.stringify(propiedades));
  }, [propiedades]);

  return (
    <PropiedadesContext.Provider value={{ propiedades, setPropiedades }}>
      {children}
    </PropiedadesContext.Provider>
  );
}

export const usePropiedades = () => useContext(PropiedadesContext);
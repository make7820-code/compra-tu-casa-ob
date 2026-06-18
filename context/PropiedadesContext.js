"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from "../../lib/firebase"; // Asegúrate de que esta ruta sea correcta
import { collection, onSnapshot } from "firebase/firestore";

const PropiedadesContext = createContext();

export function PropiedadesProvider({ children }) {
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    // CAMBIA "propiedades" por el nombre exacto de tu colección en Firebase
    const colRef = collection(db, "propiedades"); 

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Datos cargados desde Firebase:", datos);
      setPropiedades(datos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PropiedadesContext.Provider value={{ propiedades, setPropiedades }}>
      {children}
    </PropiedadesContext.Provider>
  );
}

export const usePropiedades = () => useContext(PropiedadesContext);

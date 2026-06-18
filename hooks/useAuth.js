import { useState, useEffect } from 'react';
import { auth, db } from "../lib/firebase"; // Esto conecta con tu archivo de Firebase
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Escucha cambios en el estado de autenticación de Firebase
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUsuario(user);
        // Buscamos en Firestore el documento del usuario usando su UID
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Extraemos el campo 'rol' que creamos en el Paso 1
          setRol(docSnap.data().rol);
        }
      } else {
        setUsuario(null);
        setRol(null);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  return { usuario, rol, cargando };
}
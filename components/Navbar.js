"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const pathname = usePathname();
  const [usuario, setUsuario] = useState(null);
  const [datosPerfil, setDatosPerfil] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDatosPerfil(docSnap.data());
          }
        } catch (error) {
          console.error("Error al cargar perfil:", error);
        }
      } else {
        setUsuario(null);
        setDatosPerfil(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between text-white">
      <div><img src="/mi-logo.png" className="h-16" alt="Logo" /></div>
      
      <nav className="flex items-center gap-10 text-base font-semibold">
        <Link href="/" className="hover:text-red-500">🏠 Inicio</Link>
        <Link href="/Alquiler" className="hover:text-red-500">🔑 Alquiler</Link>
        <Link href="/Comprar" className="hover:text-red-500">🏢 Comprar</Link>
        <Link href="/comunidad" className="hover:text-red-500">👥 Comunidad</Link>
        <Link href="/blog" className="hover:text-red-500">📰 Blog</Link>
        <Link href="/nosotros" className="hover:text-red-500">ℹ️ Nosotros</Link>
        <Link href="/vender" className="text-yellow-500 font-bold">🤝 Vender</Link>
        
        {/* Botón condicional para Agentes */}
        {usuario && datosPerfil?.rol === 'agente' && (
          <Link href="/Agente" className="bg-red-600 px-4 py-2 rounded-lg font-black text-xs uppercase hover:bg-red-700 transition-all">
            Panel Agente
          </Link>
        )}
      </nav>

      {usuario ? (
        <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/10">
          <Link href="/perfil">
            <img src={datosPerfil?.fotoUrl || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full border border-white/30" alt="Perfil" />
          </Link>
          <button onClick={handleLogout} className="text-red-500 font-black text-sm uppercase">SALIR</button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/registro" className="text-sm font-bold">Iniciar Sesión</Link>
        </div>
      )}
    </header>
  );
}
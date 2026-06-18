"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Blog() {
  const [datosPerfil, setDatosPerfil] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setDatosPerfil(docSnap.data());
        } catch (error) { console.error(error); }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { await signOut(auth); window.location.reload(); };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* CABECERA */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center">
            <img src="/mi-logo.png" className="h-16 w-auto object-contain" alt="Logo" />
        </div>
        
        <nav className="flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-red-500 transition-colors">🏠 Inicio</Link>
          <Link href="/comunidad" className="hover:text-red-500 transition-colors">👥 Comunidad</Link>
          <Link href="/blog" className="text-red-500">📰 Blog</Link>
          <Link href="/mensajes" className="hover:text-red-500 transition-colors">📩 Mensajes</Link>
          <Link href="/nosotros" className="hover:text-red-500 transition-colors">ℹ️ Nosotros</Link>
          <Link href="/vender" className="text-yellow-500 font-bold hover:text-yellow-400 transition-colors">🤝 Vender</Link>
          <Link href="/panelgestion" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">⚡ Panel</Link>
        </nav>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-2 rounded-full">
            <span className="text-xl cursor-pointer hover:text-yellow-500 hover:rotate-12 transition-all duration-300 transform inline-block">🔔</span>
            <div className="h-8 w-[1px] bg-white/20"></div>
            <img 
              src={datosPerfil?.fotoUrl || "/default-avatar.png"} 
              className="w-12 h-12 rounded-full border-4 border-green-500 object-cover cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-3 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]" 
              alt="Perfil" 
            />
            <button onClick={handleLogout} className="text-red-400 font-bold hover:text-red-300 ml-2 transition-colors">SALIR</button>
        </div>
      </header>

      {/* BANNER */}
      <section className="relative h-[450px] flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-900 to-black px-4">
        <div className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold mb-4 tracking-widest uppercase">Blog & Noticias</div>
        <h1 className="text-6xl font-black mb-6 leading-tight">Historias que Inspiran <br /> <span className="text-blue-500">Tu Próximo Hogar</span></h1>
        <p className="max-w-xl text-gray-400 mb-8 text-lg">Descubre tendencias inmobiliarias, consejos de expertos, y las últimas novedades del mercado en República Dominicana.</p>
        
        <div className="w-full max-w-lg">
            <input type="text" placeholder="Buscar artículos..." className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-8 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all" />
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto py-16 px-10">
        <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold">Artículos recientes</h2>
            
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-2xl p-6 border border-white/5 hover:border-blue-500/50 transition-all">
                <div className="h-40 bg-gray-800 rounded-xl mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Título del artículo</h3>
                <p className="text-gray-400 text-sm">Resumen corto del contenido del artículo para el blog...</p>
            </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0a0a0a] py-16 px-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
          <div className="space-y-4">
            <h3 className="text-red-600 text-xl font-black">Compra tu casa en RD</h3>
            <p className="text-gray-400 text-sm">Tu aliado confiable en la búsqueda y adquisición de propiedades en República Dominicana.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Navegación Rápida</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Inicio</Link></li>
              <li><Link href="/nosotros" className="hover:text-red-500 transition-colors">Acerca de Nosotros</Link></li>
              <li><Link href="/Alquiler" className="hover:text-red-500 transition-colors">Alquiler</Link></li>
              <li><Link href="/Comprar" className="hover:text-red-500 transition-colors">Comprar</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Nuestros Servicios</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/calculadora" className="hover:text-red-500 transition-colors">Calculadora Hipotecaria</Link></li>
            </ul>
          </div>
          <div className="space-y-4 text-sm text-gray-400">
            <h4 className="font-bold text-white">Contacto Directo</h4>
            <p>📍 Ubicación: República Dominicana, Santo Domingo Este, La ureña, C. El Sol</p>
            <p>📞 Teléfono: +1 (849) 857-2321</p>
            <p>📧 Correo: <a href="mailto:Danieldecena63@gmail.com" className="hover:text-red-500 transition-colors">Danieldecena63@gmail.com</a></p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
          © 2026 COMPRA TU CASA RD. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
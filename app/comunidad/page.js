"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import ModalSolicitud from '../../components/ModalSolicitud';

export default function Comunidad() {
  const [usuario, setUsuario] = useState(null);
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [mostrandoModal, setMostrandoModal] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        const docSnap = await getDoc(doc(db, "usuarios", user.uid));
        if (docSnap.exists()) setDatosPerfil(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "solicitudes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSolicitudes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => { await signOut(auth); window.location.reload(); };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 w-full h-full bg-cover bg-center z-[-1]" style={{ backgroundImage: "url('/mi-portada.jpg')" }} />
      <div className="fixed inset-0 w-full h-full bg-black/80 z-[-1]" />

      <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div><img src="/mi-logo.png" className="h-16" alt="Logo" /></div>
        <nav className="flex items-center gap-10 text-base font-semibold">
          <Link href="/" className="hover:text-red-500">Inicio</Link>
          <Link href="/Alquiler" className="hover:text-red-500">Propiedades</Link>
          <Link href="/comunidad" className="text-red-500 border-b-2 border-red-500">Comunidad</Link>
          <Link href="/blog" className="hover:text-red-500">Blog</Link>
          <Link href="/mensajes" className="hover:text-red-500">Mensajes</Link>
          <Link href="/nosotros" className="hover:text-red-500">Nosotros</Link>
          <Link href="/vender" className="hover:text-red-500">Vender</Link>
        </nav>
        {usuario ? (
          <div className="flex items-center gap-6">
            <span className="text-xl">🔔</span>
            <Link href="/perfil"><img src={datosPerfil?.fotoUrl || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full object-cover" /></Link>
            <button onClick={handleLogout} className="text-red-500 text-sm font-bold">SALIR</button>
          </div>
        ) : (
          <Link href="/registro" className="bg-red-600 px-6 py-2 rounded-full font-bold text-sm">Registrarse</Link>
        )}
      </header>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-6xl font-black text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500">
          La Comunidad
        </h1>
        <p className="text-gray-400 text-center text-lg mb-12">Conecta con los mejores profesionales, descubre oportunidades.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex bg-[#111] p-1 rounded-2xl border border-white/10 mb-8 max-w-2xl mx-auto">
              <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl">Publicaciones</button>
              <button className="flex-1 text-gray-400 hover:text-white font-bold py-3 rounded-xl transition-all">Solicitudes de Casas</button>
            </div>

            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">¿No encuentras el hogar de tus sueños?</h3>
                <p className="text-gray-300 text-sm max-w-lg">Publica tu solicitud con las características que buscas. ¡Nuestros agentes te contactarán!</p>
              </div>
              <button onClick={() => setMostrandoModal(true)} className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 whitespace-nowrap">+ Hacer Solicitud</button>
            </div>

            {/* LISTA DE SOLICITUDES */}
            <div className="mt-12 space-y-4">
              {solicitudes.map((sol) => (
                <div key={sol.id} className="bg-[#111] border border-white/10 p-6 rounded-3xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg text-blue-400">{sol.ubicacion}</h4>
                    <p className="text-gray-400 text-sm">{sol.tipoOferta} • {sol.habitaciones} hab. • {sol.banos} baños • {sol.parqueos || 0} parqueos</p>
                    <p className="text-sm mt-2 text-gray-300 italic">"{sol.descripcion}"</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{sol.presupuesto} {sol.moneda}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-full lg:w-80 bg-[#111] border border-white/10 rounded-3xl p-6 h-fit">
            <h4 className="font-bold mb-6">👤 Cuentas Recomendadas</h4>
            <div className="space-y-6">
              {['Daniel Toussaint Decena', 'onlybladi', 'David Montero', 'Gabriel Daniel Montero'].map((n, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                    <div><p className="text-sm font-bold">{n}</p></div>
                  </div>
                  <button className="text-[10px] font-bold bg-white/5 px-3 py-1 rounded-full hover:bg-white/10">Seguir</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <footer className="w-full bg-[#0a0a0a] border-t border-white/10 py-16 px-10 text-white mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div><h2 className="text-2xl font-black mb-4 text-red-600">Compra tu casa en RD</h2></div>
          <div><h3 className="font-bold mb-6 text-lg">Navegación Rápida</h3><ul className="space-y-4 text-gray-400 font-medium"><li><Link href="/">Inicio</Link></li><li><Link href="/nosotros">Nosotros</Link></li></ul></div>
          <div><h3 className="font-bold mb-6 text-lg">Servicios</h3><ul className="space-y-4 text-gray-400 font-medium"><li><Link href="/calculadora">Calculadora Hipotecaria</Link></li></ul></div>
          <div><h3 className="font-bold mb-6 text-lg">Contacto</h3><ul className="space-y-4 text-gray-400 text-sm"><li>📍 Santo Domingo, R.D.</li><li>📞 +1 (849) 857-2321</li></ul></div>
        </div>
      </footer>

      {mostrandoModal && <ModalSolicitud usuario={usuario} onClose={() => setMostrandoModal(false)} />}
    </div>
  );
}

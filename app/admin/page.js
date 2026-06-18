"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from "../../lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import Chat from '../../components/Chat';

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "solicitudes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSolicitudes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const eliminarSolicitud = async (id, e) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar esta solicitud?")) {
      await deleteDoc(doc(db, "solicitudes", id));
      if (solicitudSeleccionada?.id === id) setSolicitudSeleccionada(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HEADER INTEGRADO */}
      <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div><img src="/mi-logo.png" className="h-16" alt="Logo" /></div>
        <nav className="flex items-center gap-10 text-base font-semibold">
          <Link href="/" className="hover:text-red-500">Inicio</Link>
          <Link href="/Alquiler" className="hover:text-red-500">Propiedades</Link>
          <Link href="/comunidad" className="hover:text-red-500">Comunidad</Link>
          <Link href="/mensajes" className="hover:text-red-500">Mensajes</Link>
          <Link href="/vender" className="hover:text-red-500">Vender</Link>
        </nav>
        <div className="text-red-500 font-bold border border-red-500 px-4 py-1 rounded-full text-sm">PANEL ADMIN</div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-10 flex gap-8">
        {/* Lista de Solicitudes */}
        <div className="w-1/2 space-y-4">
          <h1 className="text-3xl font-black mb-8 text-red-500">Panel de Administración</h1>
          {solicitudes.map((sol) => (
            <div key={sol.id} onClick={() => setSolicitudSeleccionada(sol)} 
                 className={`p-6 rounded-2xl cursor-pointer border transition-all ${solicitudSeleccionada?.id === sol.id ? 'bg-[#1a1a1a] border-blue-500' : 'bg-[#111] border-white/10 hover:border-white/20'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-blue-400">{sol.ubicacion}</p>
                  <p className="text-sm text-gray-400">{sol.tipoOferta} • {sol.habitaciones} hab. • {sol.banos} baños</p>
                </div>
                <button onClick={(e) => eliminarSolicitud(sol.id, e)} className="text-red-500 text-xs font-bold hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {/* Zona de Chat y Detalles */}
        <div className="w-1/2 sticky top-28 h-fit">
          {solicitudSeleccionada ? (
            <div className="space-y-6">
              <div className="bg-[#111] p-6 rounded-2xl border border-blue-500/30">
                <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-white/10 pb-2">{solicitudSeleccionada.ubicacion}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <p><strong>Tipo:</strong> {solicitudSeleccionada.tipoOferta}</p>
                  <p><strong>Presupuesto:</strong> {solicitudSeleccionada.presupuesto} {solicitudSeleccionada.moneda}</p>
                  <p><strong>Habitaciones:</strong> {solicitudSeleccionada.habitaciones}</p>
                  <p><strong>Baños:</strong> {solicitudSeleccionada.banos}</p>
                  <p><strong>Parqueos:</strong> {solicitudSeleccionada.parqueos || 0}</p>
                  <p><strong>Email:</strong> {solicitudSeleccionada.email}</p>
                </div>
                <p className="text-sm text-gray-400 mt-4 italic bg-black/50 p-3 rounded-lg border border-white/5">
                  "{solicitudSeleccionada.descripcion}"
                </p>
              </div>
              <h3 className="font-bold text-sm text-gray-500 uppercase tracking-widest">Conversación</h3>
              <Chat solicitudId={solicitudSeleccionada.id} usuarioId="admin" />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-gray-500">
              Selecciona una solicitud para ver detalles y chatear
            </div>
          )}
        </div>
      </main>

      {/* FOOTER INTEGRADO */}
      <footer className="w-full bg-[#0a0a0a] border-t border-white/10 py-16 px-10 text-white mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div><h2 className="text-2xl font-black mb-4 text-red-600">Compra tu casa en RD</h2></div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Navegación Rápida</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/nosotros">Nosotros</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Servicios</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/calculadora">Calculadora Hipotecaria</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Contacto</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>📍República Dominicana, Santo Domingo Este, La ureña, C. El Sol</li>
              <li>📞 +1 (849) 857-2321</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
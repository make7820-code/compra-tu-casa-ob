"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function PanelGestion() {
  const [usuario, setUsuario] = useState(null);
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // Estados para herramientas
  const [montado, setMontado] = useState(false);
  const [citas, setCitas] = useState([]);
  const [nuevaCita, setNuevaCita] = useState({ fecha: '', hora: '', desc: '' });
  const [monto, setMonto] = useState(1);
  const [tipoCambio, setTipoCambio] = useState('USD');
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    setMontado(true);
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setDatosPerfil(docSnap.data());
        } catch (error) { console.error(error); }
      }
      setCargando(false);
    });
    return () => { unsubscribe(); clearInterval(timer); };
  }, []);

  const handleLogout = async () => { await signOut(auth); window.location.reload(); };
  const agregarCita = () => { if (nuevaCita.desc) setCitas([...citas, nuevaCita]); setNuevaCita({ fecha: '', hora: '', desc: '' }); };
  const borrarCita = (index) => setCitas(citas.filter((_, i) => i !== index));

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      <div className="fixed inset-0 z-[-1]"><img src="/mi-noche.jpg" className="w-full h-full object-cover" alt="Fondo" /><div className="absolute inset-0 bg-black/80" /></div>

      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between text-white">
        <Link href="/"><img src="/mi-logo.png" className="h-10 w-auto" alt="Logo" /></Link>
        <nav className="flex items-center gap-8 text-sm font-bold">
          <Link href="/" className="hover:text-red-500">🏠 Inicio</Link>
          <Link href="/Agente" className="hover:text-red-500">🚀 Publicar</Link>
          <Link href="/Cierres" className="hover:text-red-500">🔑 Cierres</Link>
          <Link href="/calculadora" className="hover:text-red-500">🧮 Calculadora</Link>
          <Link href="/leads" className="hover:text-red-500">📈 Leads</Link>
        </nav>
        {!cargando && usuario && (
            <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-full border border-white/10">
              <span className="text-xl">🔔</span>
              <img src={datosPerfil?.fotoUrl || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full object-cover border border-white/30" />
              <button onClick={handleLogout} className="text-red-500 font-black text-xs uppercase">SALIR</button>
            </div>
        )}
      </header>

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="bg-black/40 p-4 rounded-xl border border-white/10 text-center font-mono text-gray-300">
            {montado ? `${fechaHora.toLocaleDateString()} | ${fechaHora.toLocaleTimeString()}` : "Cargando fecha..."}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/60 p-6 rounded-2xl border border-white/10 aspect-square flex flex-col">
                <h3 className="font-bold text-white mb-4">📍 Mapa</h3>
                <iframe className="w-full flex-1 rounded-xl" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.5!2d-69.8!3d18.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDI0JzAwLjAiTiA2OcKwNDgnMDAuMCJX!5e0!3m2!1ses!2sdo!4v1650000000000" allowFullScreen></iframe>
            </div>

            <div className="bg-black/60 p-6 rounded-2xl border border-white/10 aspect-square flex flex-col">
                <h3 className="font-bold text-white mb-4">🗓️ Agenda</h3>
                <div className="flex flex-col gap-2 mb-4">
                    <input type="date" className="bg-white/10 p-2 rounded text-xs" onChange={e => setNuevaCita({...nuevaCita, fecha: e.target.value})} />
                    <input type="time" className="bg-white/10 p-2 rounded text-xs" onChange={e => setNuevaCita({...nuevaCita, hora: e.target.value})} />
                    <input type="text" placeholder="Tarea/Cita" className="bg-white/10 p-2 rounded text-xs" value={nuevaCita.desc} onChange={e => setNuevaCita({...nuevaCita, desc: e.target.value})} />
                    <button onClick={agregarCita} className="bg-red-600 text-white p-2 rounded font-bold">GUARDAR</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {citas.map((c, i) => (
                        <div key={i} className="bg-white/5 p-2 rounded flex justify-between text-xs text-white">
                            {c.fecha} {c.hora} - {c.desc}
                            <button onClick={() => borrarCita(i)} className="text-red-500 font-bold">X</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-black/60 p-6 rounded-2xl border border-white/10 aspect-square flex flex-col justify-center items-center">
                <h3 className="font-bold text-white mb-6">💱 Conversor</h3>
                <input type="number" className="bg-white/10 p-3 rounded-lg w-full mb-4 text-center text-white" value={monto} onChange={e => setMonto(e.target.value)} />
                <select className="bg-white/10 p-2 rounded mb-4 text-white" onChange={e => setTipoCambio(e.target.value)}>
                    <option value="USD">USD a DOP</option>
                    <option value="EUR">EUR a DOP</option>
                </select>
                <div className="text-3xl font-black text-white">
                    {tipoCambio === 'USD' ? (monto * 59.5).toFixed(2) : (monto * 64.2).toFixed(2)} DOP
                </div>
            </div>
        </div>
      </main>

      <footer className="w-full bg-black/90 border-t border-white/10 py-12 px-10 text-white mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-red-500">Compra tu casa en RD</h2>
            <p className="text-gray-400 text-sm">Tu aliado confiable en la búsqueda y adquisición de propiedades en República Dominicana.</p>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Navegación Rápida</h3>
            <ul className="space-y-3 text-gray-400 font-medium text-sm">
              <li><Link href="/" className="hover:text-red-500">Inicio</Link></li>
              <li><Link href="/nosotros" className="hover:text-red-500">Acerca de Nosotros</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Nuestros Servicios</h3>
            <ul className="space-y-3 text-gray-400 font-medium text-sm">
              <li><Link href="/calculadora" className="hover:text-red-500">Calculadora Hipotecaria</Link></li>
            </ul>
          </div>
          <div className="space-y-4 text-sm text-gray-400">
            <h3 className="font-bold text-lg text-white mb-6">Contacto Directo</h3>
            <p>📍 Ubicación: República Dominicana, Santo Domingo Este, La ureña</p>
            <p>📞 Teléfono: +1 (849) 857-2321</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
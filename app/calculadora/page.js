"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Calculadora() {
  const [usuario, setUsuario] = useState(null);
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ESTADOS DE LA CALCULADORA
  const [precio, setPrecio] = useState(25000000);
  const [inicial, setInicial] = useState(5000000);
  const [tasa, setTasa] = useState(9.5);
  const [plazo, setPlazo] = useState(5);
  const [resultado, setResultado] = useState(52583.28);

  // Función segura para formatear moneda
  const formatearMoneda = (num) => {
    return (num || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  // Efecto para cargar datos guardados
  useEffect(() => {
    const savedData = localStorage.getItem('calc_hipotecaria');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPrecio(parsed.precio);
        setInicial(parsed.inicial);
        setTasa(parsed.tasa);
        setPlazo(parsed.plazo);
        setResultado(parsed.resultado);
      } catch (e) { console.error("Error al cargar datos", e); }
    }
  }, []);

  const calcularCuota = () => {
    const principal = precio - inicial;
    const i = (tasa / 100) / 12;
    const n = plazo * 12;
    const cuotaCalculada = (principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    setResultado(cuotaCalculada);
    // Guardar en localStorage
    localStorage.setItem('calc_hipotecaria', JSON.stringify({
      precio, inicial, tasa, plazo, resultado: cuotaCalculada
    }));
  };

  useEffect(() => {
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
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col text-white">
      
      {/* FONDO DIFUMINADO */}
      <div className="fixed inset-0 z-[-1]">
        <img src="/puerto-marina.jpg" className="w-full h-full object-cover blur-sm" alt="Fondo" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div><img src="/mi-logo.png" className="h-16" alt="Logo" /></div>
        <nav className="flex items-center gap-8 text-base font-semibold">
          <Link href="/" className="hover:text-red-500 flex items-center gap-2">🏠 Inicio</Link>
          <Link href="/Alquiler" className="hover:text-red-500 flex items-center gap-2">🏙️ Alquilar</Link>
          <Link href="/Comprar" className="hover:text-red-500 flex items-center gap-2">🏢 Comprar</Link>
          <Link href="/comunidad" className="hover:text-red-500 flex items-center gap-2">👥 Comunidad</Link>
          <Link href="/blog" className="hover:text-red-500 flex items-center gap-2">📰 Blog</Link>
          {usuario && <Link href="/mensajes" className="hover:text-red-500 flex items-center gap-2">📩 Mensajes</Link>}
          <Link href="/nosotros" className="hover:text-red-500 flex items-center gap-2">ℹ️ Nosotros</Link>
          <Link href="/vender" className="text-yellow-500 font-bold flex items-center gap-2">🤝 Vender</Link>
        </nav>
        {!cargando && (
          usuario ? (
            <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-2xl">🔔</span>
              <Link href="/perfil"><img src={datosPerfil?.fotoUrl?.trim() ? datosPerfil.fotoUrl : "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full border border-white/30 object-cover" alt="Perfil" /></Link>
              <button onClick={handleLogout} className="text-red-500 font-black text-sm uppercase">SALIR</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/registro" className="text-sm font-bold hover:text-red-500">Iniciar Sesión</Link>
              <Link href="/registro" className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full text-sm font-bold">Registrarse</Link>
            </div>
          )
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10 flex flex-col items-center">
        
        {/* TÍTULO CON CASITA */}
        <div className="text-center mb-10 mt-6">
            <h1 className="text-5xl font-black text-red-600 flex items-center justify-center gap-3 mb-4">
                <span className="text-6xl">🏠</span> Calculadora Hipotecaria
            </h1>
            <p className="text-gray-300">Estima tus pagos mensuales con precisión. Incluye capital, intereses, impuestos y seguro en un solo cálculo.</p>
        </div>

        <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-10 rounded-3xl border border-white/10 max-w-5xl w-full">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                <span className="text-red-500">🧮</span> Calculadora Hipotecaria Estimada
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Precio Propiedad</label>
                    <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} className="w-full bg-[#0a0a0a] p-4 rounded-xl border border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Inicial</label>
                        <input type="number" value={inicial} onChange={(e) => setInicial(Number(e.target.value))} className="w-full bg-[#0a0a0a] p-4 rounded-xl border border-white/10" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Tasa Interés (%)</label>
                        <input type="number" value={tasa} onChange={(e) => setTasa(Number(e.target.value))} className="w-full bg-[#0a0a0a] p-4 rounded-xl border border-white/10" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Plazo (Años)</label>
                    <input type="number" value={plazo} onChange={(e) => setPlazo(Number(e.target.value))} className="w-full bg-[#0a0a0a] p-4 rounded-xl border border-white/10" />
                </div>
                <button onClick={calcularCuota} className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                    🧮 Calcular Cuota
                </button>
              </div>

              <div className="bg-[#0a0a0a] rounded-3xl p-8 flex flex-col justify-center border border-white/5">
                <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">CUOTA MENSUAL ESTIMADA</p>
                <h1 className="text-5xl font-black text-white mb-8">RD${formatearMoneda(resultado)}</h1>
                <div className="border-t border-white/10 pt-6 flex justify-between">
                    <span className="text-gray-400">Principal + Interés</span>
                    <span className="font-bold">RD${formatearMoneda(resultado)}</span>
                </div>
              </div>
            </div>
            
            {/* TEXTO DE AVISO LEGAL */}
            <div className="mt-8 text-center text-xs text-gray-500 italic">
                * Resultados estimados para fines informativos. Las tasas reales dependen de la institución financiera y tu historial crediticio.
            </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/10 py-12 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-red-500">Compra tu casa en RD</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Tu aliado confiable en la búsqueda y adquisición de propiedades en República Dominicana.</p>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Navegación Rápida</h3>
            <ul className="space-y-3 text-gray-400 font-medium">
              <li><Link href="/" className="hover:text-red-500">Inicio</Link></li>
              <li><Link href="/nosotros" className="hover:text-red-500">Acerca de Nosotros</Link></li>
              <li><Link href="/Alquiler" className="hover:text-red-500">Alquilar</Link></li>
              <li><Link href="/Comprar" className="hover:text-red-500">Comprar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Nuestros Servicios</h3>
            <ul className="space-y-3 text-gray-400 font-medium">
              <li><Link href="/calculadora" className="hover:text-red-500">Calculadora Hipotecaria</Link></li>
            </ul>
          </div>
          <div className="space-y-4 text-sm text-gray-400">
            <h3 className="font-bold text-lg text-white mb-6">Contacto Directo</h3>
            <p>📍 Ubicación: República Dominicana, Santo Domingo Este, La ureña, C. El Sol</p>
            <p>📞 Teléfono: +1 (849) 857-2321</p>
            <p>📧 Correo: <a href="mailto:Danieldecena63@gmail.com" className="text-blue-400 underline">Danieldecena63@gmail.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
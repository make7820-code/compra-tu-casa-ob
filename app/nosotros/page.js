"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Nosotros() {
  const [usuario, setUsuario] = useState(null);
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

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
      
      {/* FONDO */}
      <div className="fixed inset-0 z-[-1]">
        <img src="/mi-nosotros.jpg" className="w-full h-full object-cover blur-sm" alt="Fondo" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div><img src="/mi-logo.png" className="h-16" alt="Logo" /></div>
        <nav className="flex items-center gap-8 text-base font-semibold">
          <Link href="/" className="hover:text-red-500 flex items-center gap-2">🏠 Inicio</Link>
          
          {/* BOTONES CON ICONOS DISTINTOS */}
          <Link href="/Alquiler" className="hover:text-red-500 flex items-center gap-2">🏙️ Alquilar</Link>
          <Link href="/Comprar" className="hover:text-red-500 flex items-center gap-2">🏢 Comprar</Link>
          
          <Link href="/comunidad" className="hover:text-red-500 flex items-center gap-2">👥 Comunidad</Link>
          <Link href="/blog" className="hover:text-red-500 flex items-center gap-2">📰 Blog</Link>
          {usuario && <Link href="/mensajes" className="hover:text-red-500 flex items-center gap-2">📩 Mensajes</Link>}
          <Link href="/nosotros" className="text-red-500 font-bold flex items-center gap-2">ℹ️ Nosotros</Link>
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
        <div className="max-w-5xl w-full text-center">
            
            <div className="bg-black/40 backdrop-blur-md p-10 rounded-3xl border border-white/10 mb-10">
                <h1 className="text-5xl font-black mb-10">Sobre <span className="text-red-500">Nosotros</span></h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-black/60 p-6 rounded-2xl border border-white/10 text-left transition-transform duration-300 hover:scale-105 hover:border-red-500/50 cursor-default">
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">🎯 Nuestra Misión</h3>
                        <p className="text-gray-400">Facilitar y hacer transparente el proceso de adquisición de propiedades, brindando seguridad y confianza a nuestros usuarios en cada paso.</p>
                    </div>
                    <div className="bg-black/60 p-6 rounded-2xl border border-white/10 text-left transition-transform duration-300 hover:scale-105 hover:border-red-500/50 cursor-default">
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">👁️ Nuestra Visión</h3>
                        <p className="text-gray-400">Ser la plataforma inmobiliaria líder y más confiable de la República Dominicana, innovando constantemente para conectar sueños con realidades.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[
                        { icon: '🏠', title: 'Amplia Selección', desc: 'Extensa base de datos de casas, apartamentos y locales en venta y alquiler en toda RD.' },
                        { icon: '🔍', title: 'Búsqueda Intuitiva', desc: 'Filtros avanzados por ubicación, precio y características para encontrar exactamente lo que buscas.' },
                        { icon: 'ℹ️', title: 'Información Confiable', desc: 'Descripciones detalladas, galerías de fotos de alta calidad y ubicaciones precisas garantizadas.' },
                        { icon: '🤝', title: 'Red de Profesionales', desc: 'Contacto directo con agentes certificados y dueños de propiedades para la mejor asesoría.' },
                        { icon: '💡', title: 'Recursos Expertos', desc: 'Acceso a guías completas, herramientas y calculadoras para tomar decisiones informadas.' },
                        { icon: '❤️', title: 'Tu Satisfacción', desc: 'Comprometidos con brindarte la mejor experiencia en cada etapa hacia tu nuevo hogar.' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-black/60 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 cursor-default">
                            <span className="text-4xl mb-4 bg-white/5 p-4 rounded-full">{item.icon}</span>
                            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-red-900/40 to-black/40 p-10 rounded-3xl border border-white/10">
                    <h2 className="text-3xl font-black mb-4">¿Listo para encontrar tu hogar ideal?</h2>
                    <p className="text-gray-300 mb-8">Explora nuestra amplia selección de propiedades o contáctanos directamente para recibir asesoría personalizada.</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/Alquiler" className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold transition">Alquilar</Link>
                        <Link href="/Comprar" className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold transition">Comprar</Link>
                    </div>
                </div>
            </div>

            {/* TESTIMONIOS */}
            <div className="bg-black/40 backdrop-blur-md p-10 rounded-3xl border border-white/10">
                <h4 className="text-violet-500 font-bold uppercase tracking-widest text-sm mb-2">Historias de éxito</h4>
                <h2 className="text-4xl font-black mb-12">Lo que dicen nuestros clientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: 'Carlos Rodríguez', text: 'El proceso de alquiler fue muy sencillo y rápido. La plataforma es muy intuitiva. ¡Recomiendo esta página a todos!', img: '/foto-carloss.jpg' },
                        { name: 'María Pérez', text: 'Encontré la casa perfecta para mi familia gracias a CompraTuCasaEnRD. ¡Excelente servicio y acompañamiento en todo momento!', img: '/foto-maria.jpg' },
                        { name: 'Ana Gómez', text: 'La variedad de propiedades y la facilidad de búsqueda hicieron que encontrar mi apartamento ideal fuera muy fácil.', img: '/foto-ana.jpg' }
                    ].map((t, i) => (
                        <div key={i} className="bg-black/80 p-8 rounded-3xl border border-white/10 relative transition-transform duration-300 hover:scale-105 hover:border-violet-500/50 cursor-default flex flex-col justify-between">
                            <div className="flex gap-1 mb-4 justify-center">
                                {[...Array(5)].map((_, starIdx) => (
                                    <span key={starIdx} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-6 italic flex-1">{t.text}</p>
                            <div className="flex items-center gap-3 justify-start pt-6 border-t border-white/10">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">{t.name}</p>
                                    <p className="text-violet-400 text-xs">CLIENTE VERIFICADO</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>

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
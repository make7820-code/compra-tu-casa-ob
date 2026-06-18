"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [indiceActivo, setIndiceActivo] = useState(0);

  const testimonios = [
    { nombre: "Jorge Maldonado", texto: "Richy Rojas Tiene una cualidad excepcional, que el se hace amigo de los clientes, considero que eso le abre muchas puertas. Le compré mi casa y gané un amigo.", color: "bg-red-500" },
    { nombre: "Miguel Fabian", texto: "Compra tu casa en RD Proporciona un servicio excepcional. Su equipo experto y personalizado hizo que encontrara mi nueva casa fuera una experiencia fácil y agradable.", color: "bg-gray-600" },
    { nombre: "Fraulin Caminero", texto: "Es gratificante hacer mi primera inversión. Tener mi casa fue con muchos sacrificios y planificación financiera, pero lo pudimos hacer de la mano de Compra tu casa en RD.", color: "bg-green-500" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndiceActivo((prev) => (prev + 1) % testimonios.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
          console.error(error);
        }
      } else {
        setUsuario(null);
        setDatosPerfil(null);
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
    <div className="relative min-h-screen w-full flex flex-col bg-black text-white">
      
      <header className="sticky top-0 z-50 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div><img src="/mi-logo.png" className="h-16" alt="Logo" /></div>
        <nav className="flex items-center gap-10 text-base font-semibold flex-1 justify-center">
          <Link href="/" className="text-red-500 flex items-center gap-2">🏠 Inicio</Link>
          <Link href="/comunidad" className="hover:text-red-500 flex items-center gap-2">👥 Comunidad</Link>
          <Link href="/blog" className="hover:text-red-500 flex items-center gap-2">📰 Blog</Link>
          {usuario && <Link href="/mensajes" className="hover:text-red-500 flex items-center gap-2">📩 Mensajes</Link>}
          <Link href="/nosotros" className="hover:text-red-500 flex items-center gap-2">ℹ️ Nosotros</Link>
          <Link href="/vender" className="text-yellow-500 font-bold flex items-center gap-2">🤝 Vender</Link>
          {datosPerfil?.rol === 'agente' && (
            <Link href="/panelgestion" className="text-yellow-400 font-bold flex items-center gap-2 hover:text-white">⚡ Panel</Link>
          )}
        </nav>
        {!cargando && (
          usuario ? (
            <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-2xl cursor-pointer transition-transform duration-300 hover:rotate-12 hover:scale-125">🔔</span>
              <Link href="/perfil" className="transition-transform duration-300 hover:scale-110">
                <div className={`${datosPerfil?.rol === 'agente' ? 'p-0.5 rounded-full border-4 !border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : ''}`}>
                  <img src={datosPerfil?.fotoUrl?.trim() ? datosPerfil.fotoUrl : "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full object-cover" alt="Perfil" />
                </div>
              </Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-black hover:bg-white px-4 py-1.5 rounded-lg font-black text-sm uppercase transition-all duration-300">
                SALIR
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/registro" className="text-sm font-bold hover:text-red-500">Iniciar Sesión</Link>
              <Link href="/registro" className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full text-sm font-bold">Registrarse</Link>
            </div>
          )
        )}
      </header>

      <div className="w-full h-[600px] relative flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/mi-portada.png')", backgroundColor: "#333", zIndex: 0 }} />
        <div className="absolute inset-0 bg-black/60 z-[1]" />
        <div className="mb-12 z-[2] relative">
          <p className="text-2xl font-semibold mb-2 drop-shadow-lg">Bienvenidos a</p>
          <h1 className="text-6xl font-black mb-4 flex items-center justify-center gap-3 drop-shadow-2xl"><span>🏠</span> Compra tu casa en RD</h1>
        </div>
        <div className="flex flex-col gap-6 items-center w-full z-[2] relative">
          <div className="flex gap-6">
            <Link href="/Alquiler" className="bg-green-600 hover:bg-green-700 px-10 py-4 rounded-xl font-bold transition-all text-lg shadow-xl">Alquilar</Link>
            <Link href="/Comprar" className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-bold transition-all text-lg shadow-xl">Comprar</Link>
          </div>
          <a href="https://wa.me/18093042797?text=Hola, me gustaría publicar mi propiedad." target="_blank" rel="noopener noreferrer" className="bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-xl font-black transition-all shadow-xl text-lg">
            PUBLICAR MI PROPIEDAD
          </a>
        </div>
      </div>

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto my-12 p-6 md:p-12 bg-[#111] rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h2 className="text-5xl font-black">Nosotros</h2>
            <p className="text-xl font-bold text-red-600">Compra tu casa en RD</p>
            <p className="text-gray-400 leading-relaxed text-lg">Somos tus expertos inmobiliarios en República Dominicana. Te ofrecemos asesoramiento especializado para ayudarte a encontrar la mejor inversión para rentar o vivir, acompañándote en cada paso del proceso de compra. Nuestro compromiso es hacer que encontrar el hogar de tus sueños sea una experiencia fácil y segura. ¡Descubre las mejores propiedades con nosotros!</p>
            <Link href="/nosotros"><button className="bg-red-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-red-700 transition-all transform hover:-translate-y-1 active:scale-95">Ver más</button></Link>
          </div>
          <div className="flex-1 w-full"><img src="/puerto-marina.jpg" alt="Puerto Marina" className="w-full h-auto rounded-3xl shadow-2xl" /></div>
        </section>

        <section className="w-full py-24 bg-[#1a1a1a] border-y border-white/5 flex flex-col items-center">
          <h2 className="text-5xl font-black mb-16">Testimonios</h2>
          <div className="relative w-[700px] h-[350px]">
            {testimonios.map((t, index) => (
              <div key={index} className={`absolute transition-all duration-500 ${t.color} w-[700px] h-full p-12 rounded-3xl ${index === indiceActivo ? "opacity-100" : "opacity-0"}`}>
                <h3 className="text-3xl font-bold">{t.nombre}</h3>
                <p className="text-xl italic">"{t.texto}"</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto my-20 bg-gray-100 p-8 rounded-3xl shadow-lg border border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 items-center text-black">
            <div className="flex flex-col items-center">
              <img src="/mi-camion.jpg" alt="Servicio de Mudanza" className="w-full h-auto rounded-2xl" />
              <p className="font-bold text-center mt-4 text-lg">Tu acarreo de confianza en República Dominicana</p>
            </div>
            <div className="flex flex-col items-center md:items-start justify-center space-y-4 text-center md:text-left">
              <h2 className="text-4xl font-black">¡Haz tu <span className="text-red-600">mudanza</span> con nosotros!</h2>
              <p className="text-gray-800 text-lg font-medium">Tu Mudanza sin Estrés: Precios Justos y Transparentes.</p>
              <p className="text-red-600 font-black text-xl">LLÁMANOS AHORA MISMO</p>
              <p className="font-black text-4xl">+1(849) 857-2321</p>
              <div className="w-full flex justify-center md:justify-start mt-4">
                <a href="tel:+18498572321" className="bg-red-600 text-white font-black py-4 px-8 rounded-xl hover:bg-red-700 transition-all transform hover:-translate-y-1 text-lg shadow-lg flex items-center justify-center">¡Llamar para Presupuesto!</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#0a0a0a] py-16 px-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
          <div className="space-y-4">
            <h3 className="text-red-600 text-xl font-black">Compra tu casa en RD</h3>
            <p className="text-gray-400 text-sm">Tu aliado confiable en la búsqueda y adquisición de propiedades en República Dominicana.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Navegación Rápida</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="text-red-500">Inicio</Link></li>
              <li><Link href="/nosotros" className="hover:text-red-500">Acerca de Nosotros</Link></li>
              <li><Link href="/Alquiler" className="hover:text-red-500">Alquiler</Link></li>
              <li><Link href="/Comprar" className="hover:text-red-500">Comprar</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Nuestros Servicios</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/calculadora" className="hover:text-red-500">Calculadora Hipotecaria</Link></li>
            </ul>
          </div>
          <div className="space-y-4 text-sm text-gray-400">
            <h4 className="font-bold text-white">Contacto Directo</h4>
            <p>📍 Ubicación: República Dominicana, Santo Domingo Este, La ureña, C. El Sol</p>
            <p>📞 Teléfono: +1 (849) 857-2321</p>
            <p>📧 Correo: <a href="mailto:Danieldecena63@gmail.com" className="hover:text-red-500">Danieldecena63@gmail.com</a></p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
          © 2026 COMPRA TU CASA RD. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
} 
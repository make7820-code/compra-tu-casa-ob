"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePropiedades } from '../../context/PropiedadesContext'; 
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function Comprar() {
  const pathname = usePathname();
  const [estaMontado, setEstaMontado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [mostrandoFavoritos, setMostrandoFavoritos] = useState(false);
  const [soloExclusivas, setSoloExclusivas] = useState(false);

  const [filtros, setFiltros] = useState({ 
    busqueda: "", 
    tipo: "Todos", 
    provincia: "Todos",
    municipio: "Todos",
    distrito: "Todos",
    oferta: "Todos",
    habs: "Cualquiera"
  });
  const { propiedades } = usePropiedades();
  const [indicesFotos, setIndicesFotos] = useState({});
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null); 

  useEffect(() => {
    setEstaMontado(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDatosPerfil(data);
            setFavoritos(data.favoritos || []);
          }
        } catch (error) { console.error(error); }
      } else {
        setUsuario(null); setDatosPerfil(null); setFavoritos([]);
      }
    });

    const interval = setInterval(() => {
      setIndicesFotos(prev => {
        const nuevosIndices = { ...prev };
        propiedades.forEach(p => {
          if (p.imagenes?.length > 1) {
            nuevosIndices[p.id] = ((prev[p.id] || 0) + 1) % p.imagenes.length;
          }
        });
        return nuevosIndices;
      });
    }, 3000);
    return () => { unsubscribe(); clearInterval(interval); };
  }, [propiedades]);

  const toggleFavorito = async (id) => {
    if (!usuario) return alert("Debes iniciar sesión");
    const docRef = doc(db, "usuarios", usuario.uid);
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(f => f !== id));
      await updateDoc(docRef, { favoritos: arrayRemove(id) });
    } else {
      setFavoritos([...favoritos, id]);
      await updateDoc(docRef, { favoritos: arrayUnion(id) });
    }
  };

  const handleLogout = async () => { await signOut(auth); window.location.reload(); };

  if (!estaMontado) return null;

  const propiedadesFiltradas = propiedades.filter(p => {
    if (p.estado === "Archivada" || p.operacion !== "Venta") return false;
    const coincideTipo = filtros.tipo === "Todos" || p.tipo === filtros.tipo;
    const coincideBusqueda = !filtros.busqueda || p.titulo?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const coincideProvincia = filtros.provincia === "Todos" || p.provincia === filtros.provincia;
    const coincideMunicipio = filtros.municipio === "Todos" || p.municipio === filtros.municipio;
    const coincideDistrito = filtros.distrito === "Todos" || p.distrito === filtros.distrito;
    const coincideHabs = filtros.habs === "Cualquiera" || (filtros.habs === "4+" ? parseInt(p.habitaciones || 0) >= 4 : p.habitaciones?.toString() === filtros.habs);
    const coincideFavorito = !mostrandoFavoritos || favoritos.includes(p.id);
    const coincideExclusivo = soloExclusivas === false ? true : p.esExclusiva === true;
    return coincideTipo && coincideBusqueda && coincideProvincia && coincideMunicipio && coincideDistrito && coincideHabs && coincideFavorito && coincideExclusivo;
  });

  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 w-full h-full bg-cover bg-center z-[-1]" style={{ backgroundImage: "url('/mi-portada.jpg')" }} />
      <div className="fixed inset-0 w-full h-full bg-black/80 z-[-1]" />

      <header className="sticky top-0 z-50 w-full bg-black/50 backdrop-blur-md border-b border-white/10 px-10 py-6 flex items-center justify-between text-white">
        <div><img src="/mi-logo.png" className="h-16" alt="Logo" /></div>
        <nav className="flex items-center gap-10 text-base font-semibold">
          <Link href="/" className={`${pathname === '/' ? 'text-red-500' : 'hover:text-red-500'} flex items-center gap-2`}>🏠 Inicio</Link>
          <Link href="/Alquiler" className={`${pathname === '/Alquiler' ? 'text-red-500' : 'hover:text-red-500'} flex items-center gap-2`}>🔑 Alquiler</Link>
          <Link href="/Comprar" className={`${pathname === '/Comprar' ? 'text-red-500' : 'hover:text-red-500'} flex items-center gap-2`}>🏢 Comprar</Link>
          <Link href="/comunidad" className={`${pathname === '/comunidad' ? 'text-red-500' : 'hover:text-red-500'} flex items-center gap-2`}>👥 Comunidad</Link>
          <Link href="/blog" className={`${pathname === '/blog' ? 'text-red-500' : 'hover:text-red-500'} flex items-center gap-2`}>📰 Blog</Link>
          {usuario && <Link href="/mensajes" className={`${pathname === '/mensajes' ? 'text-red-500' : 'hover:text-red-500'} flex items-center gap-2`}>📩 Mensajes</Link>}
          <Link href="/nosotros" className={`${pathname === '/nosotros' ? 'text-red-500' : 'hover:text-red-500'} flex items-center gap-2`}>ℹ️ Nosotros</Link>
          <Link href="/vender" className="text-yellow-500 font-bold flex items-center gap-2">🤝 Vender</Link>
        </nav>
        
        {usuario ? (
          <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-2xl cursor-pointer">🔔</span>
            <Link href="/perfil">
              <img src={datosPerfil?.fotoUrl?.trim() ? datosPerfil.fotoUrl : "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full border border-white/30 object-cover" alt="Perfil" />
            </Link>
            <button onClick={handleLogout} className="text-red-500 font-black text-sm uppercase">SALIR</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/registro" className="text-sm font-bold hover:text-red-500">Iniciar Sesión</Link>
            <Link href="/registro" className="bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-full text-sm font-bold">Registrarse</Link>
          </div>
        )}
      </header>

      <section className="py-16 flex flex-col items-center text-center text-white">
        <h1 className="text-5xl font-black mb-4">Propiedades en Venta</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Explora nuestra selección de <span className="text-red-500 font-black">{propiedadesFiltradas.length}</span> propiedades premium.
        </p>
        <div className="flex gap-4">
          <button onClick={() => setSoloExclusivas(!soloExclusivas)} className={`${soloExclusivas ? "bg-amber-600" : "bg-white/10"} hover:bg-amber-700 text-white px-8 py-3 rounded-full font-bold transition-all`}>⭐ {soloExclusivas ? "MOSTRANDO LO MÁS EXCLUSIVO" : "LO MAS EXCLUSIVO"}</button>
          <button onClick={() => setMostrandoFavoritos(!mostrandoFavoritos)} className={`${mostrandoFavoritos ? "bg-red-600" : "bg-white/10"} hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all`}>❤️ {mostrandoFavoritos ? "Ver Todas" : "Ver Mis Favoritos"}</button>
        </div>
      </section>

      <div className="flex p-6 gap-8">
        <aside className="w-[340px] bg-[#111] border border-white/10 rounded-3xl p-6 h-fit sticky top-24 backdrop-blur-xl">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white"><span className="w-1 h-6 bg-red-500 rounded-full"></span> Filtros de Búsqueda</h2>
          <div className="space-y-5">
            <input className="w-full bg-[#1a1a1a] p-3 rounded-lg text-sm border border-white/10 text-white" placeholder="Buscar..." onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})} />
            <Selector label="Provincia" opciones={["Todos", "Santo Domingo", "Distrito Nacional"]} value={filtros.provincia} onChange={(v) => setFiltros({...filtros, provincia: v})} />
            <Selector label="Municipio" opciones={["Todos", "Santo Domingo Este", "Santo Domingo Norte"]} value={filtros.municipio} onChange={(v) => setFiltros({...filtros, municipio: v})} />
            <Selector label="Distrito" opciones={["Todos", "Brisa Oriental", "Alma Rosa"]} value={filtros.distrito} onChange={(v) => setFiltros({...filtros, distrito: v})} />
            <Selector label="Tipo" opciones={["Todos", "Apartamento", "Casa", "Villa"]} value={filtros.tipo} onChange={(v) => setFiltros({...filtros, tipo: v})} />
            <Selector label="Habs" opciones={["Cualquiera", "1", "2", "3", "4+"]} value={filtros.habs} onChange={(v) => setFiltros({...filtros, habs: v})} />
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {propiedadesFiltradas.map((p) => (
              <div key={p.id} className="bg-[#111] p-4 rounded-2xl border border-white/10 hover:border-red-500 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full relative">
                <div className="cursor-pointer" onClick={() => setPropiedadSeleccionada(p)}>
                  <div className="relative h-40 overflow-hidden rounded-xl mb-3 bg-gray-900">
                    <div className="absolute top-2 left-2 z-20 px-2 py-0.5 bg-green-700 text-white text-[9px] font-black uppercase rounded">{p.estado || "Disponible"}</div>
                    {p.imagenes?.map((img, i) => (
                      <img key={i} src={img} className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${i === (indicesFotos[p.id] || 0) ? 'opacity-100' : 'opacity-0'}`} alt="propiedad" />
                    ))}
                  </div>
                  <h3 className="text-lg font-black truncate text-white">{p.titulo}</h3>
                  <p className="font-bold my-1 text-lg text-green-500">{p.moneda} {p.precio}</p>
                  <div className="text-[12px] text-gray-400 mt-1 flex flex-col flex-grow">
                    <p className="text-white font-semibold">{p.tipo} • {p.distrito}, {p.municipio}</p>
                    <div className="flex gap-3 my-2 text-white font-bold flex-wrap">
                      <span title="Habitaciones">🛏️ {p.habitaciones}</span>
                      <span title="Baños">🚿 {p.banos}</span>
                      <span title="Parqueos">🚗 {p.parking || "0"}</span>
                      <span title="Metros cuadrados">📏 {p.metrosCuadrados}m²</span>
                    </div>
                    <p className="text-gray-400 text-[11px] leading-tight break-words line-clamp-2">{p.detalles}</p>
                  </div>
                </div>
                <button onClick={() => toggleFavorito(p.id)} className={`mt-4 w-full py-2 rounded-lg text-[11px] font-bold ${favoritos.includes(p.id) ? "bg-red-600 text-white" : "bg-white/5 text-white"}`}>❤️ FAVORITO</button>
                <a href={`https://wa.me/18090000000?text=Hola, interesado en: ${p.titulo}`} target="_blank" className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-[11px] font-bold text-white text-center">💬 WHATSAPP</a>
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className="w-full bg-[#0a0a0a] border-t border-white/10 py-16 px-10 text-white mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <h2 className="text-2xl font-black mb-4 text-red-600">Compra tu casa en RD</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Tu aliado confiable en la búsqueda y adquisición de propiedades en República Dominicana.</p>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Navegación Rápida</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/nosotros">Acerca de Nosotros</Link></li>
              <li><Link href="/Alquiler">Alquiler</Link></li>
              <li><Link href="/Comprar">Comprar</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Nuestros Servicios</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/calculadora">Calculadora Hipotecaria</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-6 text-lg">Contacto Directo</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>📍 Ubicación: República Dominicana, Santo Domingo Este, La ureña, C. El Sol</li>
              <li>📞 <a href="tel:+18498572321">Teléfono: +1 (849) 857-2321</a></li>
              <li>📧 <a href="mailto:Danieldecena63@gmail.com">Correo: Danieldecena63@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600">© 2026 COMPRA TU CASA RD. Todos los derechos reservados.</div>
      </footer>

      {propiedadSeleccionada && <ModalDetalle p={propiedadSeleccionada} onClose={() => setPropiedadSeleccionada(null)} />}
    </div>
  );
}

const ModalDetalle = ({ p, onClose }) => {
  const [fotoIdx, setFotoIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111] max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 text-white w-10 h-10 rounded-full font-black hover:bg-red-600">×</button>
        <div className="relative h-96 rounded-2xl mb-6 bg-black overflow-hidden flex items-center justify-center">
          <img src={p.imagenes?.[fotoIdx]} className="w-full h-full object-contain" alt={p.titulo} />
          {p.imagenes?.length > 1 && (
            <>
              <button onClick={() => setFotoIdx(prev => (prev === 0 ? p.imagenes.length - 1 : prev - 1))} className="absolute left-4 top-1/2 bg-black/50 p-2 rounded-full text-white">◀</button>
              <button onClick={() => setFotoIdx(prev => (prev === p.imagenes.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 bg-black/50 p-2 rounded-full text-white">▶</button>
            </>
          )}
          <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white font-bold">{fotoIdx + 1} / {p.imagenes?.length || 1}</div>
        </div>
        <h2 className="text-3xl font-black text-white">{p.titulo}</h2>
        <p className="text-2xl font-black text-green-500 my-2">{p.moneda} {p.precio}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white my-6">
            <div className="bg-white/5 p-4 rounded-xl">📍 {p.distrito}, {p.municipio}</div>
            <div className="bg-white/5 p-4 rounded-xl">📏 {p.metrosCuadrados} m²</div>
            <div className="bg-white/5 p-4 rounded-xl">🛏️ {p.habitaciones} Hab.</div>
            <div className="bg-white/5 p-4 rounded-xl">🚿 {p.banos} Baños</div>
            <div className="bg-white/5 p-4 rounded-xl">🚗 {p.parking || "0"} Park.</div>
        </div>
        <p className="text-gray-300 leading-relaxed mb-8">{p.detalles}</p>
        <a href={`https://wa.me/18090000000?text=Hola, interesado en: ${p.titulo}`} target="_blank" className="block w-full text-center bg-green-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-green-700">💬 CONTACTAR POR WHATSAPP</a>
      </div>
    </div>
  );
};

const Selector = ({ label, opciones, onChange, value }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">{label}</label>
    <select 
      value={value} 
      className="w-full bg-[#1a1a1a] p-3 rounded-lg text-sm border border-white/10 text-white" 
      onChange={(e) => onChange?.(e.target.value)}
    >
      {opciones.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);
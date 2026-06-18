"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { usePropiedades } from '../../context/PropiedadesContext';
import Navbar from "../../components/Navbar";

// --- DATOS GEOGRÁFICOS ---
const DATA_GEO = {
  "Santiago": ["Santiago", "Bisonó", "Jánico", "Licey al Medio", "Puñal", "Sabana Iglesia", "San José de las Matas", "Tamboril", "Villa González"],
  "Puerto Plata": ["Puerto Plata", "Altamira", "Guananico", "Imbert", "Los Hidalgos", "Luperón", "Sosúa", "Villa Isabela", "Villa Montellano"],
  "Espaillat": ["Moca", "Cayetano Germosén", "Gaspar Hernández", "Jamao al Norte"],
  "La Vega": ["Concepción de La Vega", "Constanza", "Jarabacoa", "Jima Abajo"],
  "Monseñor Nouel": ["Bonao", "Maimón", "Piedra Blanca"],
  "Sánchez Ramírez": ["Cotuí", "Cevicos", "Fantino", "La Mata"],
  "Duarte": ["San Francisco de Macorís", "Arenoso", "Castillo", "Eugenio María de Hostos", "Las Guáranas", "Pimentel", "Villa Riva"],
  "Hermanas Mirabal": ["Salcedo", "Tenares", "Villa Tapia"],
  "María Trinidad Sánchez": ["Nagua", "Cabrera", "El Factor", "Río San Juan"],
  "Samaná": ["Samaná", "Las Terrenas", "Sánchez"],
  "Valverde": ["Mao", "Esperanza", "Laguna Salada"],
  "Monte Cristi": ["Montecristi", "Castañuela", "Guayubín", "Las Matas de Santa Cruz", "Pepillo Salcedo", "Villa Vásquez"],
  "Dajabón": ["Dajabón", "El Pino", "Loma de Cabrera", "Partido", "Restauración"],
  "Santiago Rodríguez": ["San Ignacio de Sabaneta", "Los Almácigos", "Monción"],
  "San Cristóbal": ["San Cristóbal", "Bajos de Haina", "Cambita Garabito", "Los Cacaos", "Sabana Grande de Palenque", "San Gregorio de Nigua", "Villa Altagracia", "Yaguate"],
  "Azua": ["Azua de Compostela", "Estebanía", "Guayabal", "Las Charcas", "Las Yayas de Viajama", "Padre Las Casas", "Peralta", "Pueblo Viejo", "Sabana Yegua", "Tábara Arriba"],
  "Peravia": ["Baní", "Nizao"],
  "San José de Ocoa": ["San José de Ocoa", "Rancho Arriba", "Sabana Larga"],
  "Barahona": ["Barahona", "Cabral", "El Peñón", "Enriquillo", "Fundación", "Jaquimeyes", "La Ciénaga", "Las Salinas", "Paraíso", "Polo", "Vicente Noble"],
  "Baoruco": ["Neiba", "Galván", "Los Ríos", "Tamayo", "Villa Jaragua"],
  "Pedernales": ["Pedernales", "Oviedo"],
  "Independencia": ["Jimaní", "Cristóbal", "Duvergé", "La Descubierta", "Mella", "Postrer Río"],
  "San Juan": ["San Juan de la Maguana", "Bohechío", "El Cercado", "Juan de Herrera", "Las Matas de Farfán", "Vallejuelo"],
  "Elías Piña": ["Comendador", "Bánica", "El Llano", "Hondo Valle", "Juan Santiago", "Pedro Santana"],
  "Distrito Nacional": ["Santo Domingo de Guzmán"],
  "Santo Domingo": ["Santo Domingo Este", "Boca Chica", "Los Alcarrizos", "Pedro Brand", "San Antonio de Guerra", "Santo Domingo Norte", "Santo Domingo Oeste"],
  "La Romana": ["La Romana", "Guaymate", "Villa Hermosa"],
  "La Altagracia": ["Higüey", "San Rafael del Yuma"],
  "El Seibo": ["El Seibo", "Miches"],
  "San Pedro de Macorís": ["San Pedro de Macorís", "Consuelo", "Guayacanes", "Quisqueya", "Ramón Santana", "San José de Los Llanos"],
  "Hato Mayor": ["Hato Mayor del Rey", "El Valle", "Sabana de la Mar"],
  "Monte Plata": ["Monte Plata", "Bayaguana", "Peralvillo", "Sabana Grande de Boyá", "Yamasá"]
};

const TIPOS_PROPIEDAD = ["Apartamento", "Casa", "Solar", "Local", "Villa", "Penthouse", "Estudio", "Finca", "Apartaestudio", "Terreno", "Oficina", "Nave Industrial"];
const ESTADOS = ["Disponible", "En proceso", "Vendida", "Rentada", "Archivada"];

// --- COMPONENTE DE TARJETA ---
const TarjetaPropiedad = ({ p, onEdit, onDelete, onDuplicate, onArchive }) => {
  const [montado, setMontado] = useState(false);
  const [indiceFoto, setIndiceFoto] = useState(0);
  useEffect(() => setMontado(true), []);
  if (!montado) return null;
  const tieneFotos = p.imagenes && p.imagenes.length > 0;

  return (
    <div className={`bg-[#111] p-4 rounded-xl border ${p.estado === 'Archivada' ? 'border-gray-700 opacity-60' : 'border-white/10 hover:border-red-500'} transition-all flex flex-col h-full relative`}>
      <div className={`absolute top-2 right-2 z-20 px-2 py-1 rounded text-[10px] font-black uppercase ${p.estado === 'Archivada' ? 'bg-gray-800 text-gray-400' : p.estado === 'Vendida' ? 'bg-red-900 text-red-200' : p.estado === 'En proceso' ? 'bg-yellow-600 text-black' : p.estado === 'Rentada' ? 'bg-purple-700 text-white' : 'bg-green-700 text-white'}`}>
        {p.estado || "Disponible"}
      </div>
      <div className="relative h-28 overflow-hidden rounded-xl mb-2 bg-gray-900 group">
        {tieneFotos ? (
          <>
            <img src={p.imagenes[indiceFoto]} className="w-full h-full object-cover transition-opacity duration-150" alt="propiedad" />
            {p.imagenes.length > 1 && (
              <div className="absolute inset-0 flex justify-between items-center px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => setIndiceFoto(prev => (prev === 0 ? p.imagenes.length - 1 : prev - 1))} className="bg-black/50 p-1 rounded-full text-white text-[12px]">◀</button>
                <button type="button" onClick={() => setIndiceFoto(prev => (prev === p.imagenes.length - 1 ? 0 : prev + 1))} className="bg-black/50 p-1 rounded-full text-white text-[12px]">▶</button>
              </div>
            )}
          </>
        ) : <div className="flex items-center justify-center h-full text-gray-500 text-[10px] text-center p-2">Próximamente disponible</div>}
      </div>
      <h3 className="text-base font-black truncate text-white">{p.titulo}</h3>
      <p className="font-bold my-1 text-base"><span className="text-red-600">{p.moneda} </span><span className="text-green-500">{p.precio}</span></p>
      <div className="flex gap-1 mb-2 flex-wrap">
        <span className="text-[10px] bg-white text-black font-black px-2 py-1 rounded uppercase">{p.operacion || "Venta"}</span>
        {p.esNegociable && <span className="text-[10px] bg-yellow-600 text-black font-bold px-2 py-1 rounded">NEGOCIABLE</span>}
        {p.esExtranjero && <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-1 rounded">APTO EXTRANJERO</span>}
        {p.esExclusiva && <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-1 rounded">EXCLUSIVA</span>}
      </div>
      <div className="text-[13px] text-gray-400 mt-1 flex flex-col flex-grow">
        <p className="text-white font-semibold">{p.tipo} • {p.distrito}, {p.municipio}</p>
        {p.nombreAgente && <p className="text-red-500 font-bold mt-1">👤 {p.nombreAgente}</p>}
        <div className="flex gap-3 my-2 text-white font-bold flex-wrap">
          <span title="Habitaciones">🛏️ {p.habitaciones}</span>
          <span title="Baños">🚿 {p.banos}</span>
          <span title="Parqueos">🚗 {p.parking}</span>
          <span title="Metros cuadrados">📏 {p.metrosCuadrados}m²</span>
          <span title="Depósitos">💰 {p.depositos} Dep.</span>
        </div>
        {p.ubicacionUrl && <a href={p.ubicacionUrl} target="_blank" rel="noopener noreferrer" className="block text-center bg-blue-600 text-white font-bold py-2 rounded-lg mb-2 text-[11px] hover:bg-blue-700 transition-colors">📍 VER UBICACIÓN</a>}
        <p className="text-gray-300 text-[13px] leading-relaxed break-words bg-black/20 p-2 rounded">{p.detalles || "Sin descripción"}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-auto pt-3">
        <button type="button" onClick={() => onEdit(p)} className="bg-white/10 py-3 rounded-lg text-[11px] font-black text-white hover:bg-white/20">EDITAR</button>
        <button type="button" onClick={() => onDuplicate(p)} className="bg-blue-900/30 text-blue-400 py-3 rounded-lg text-[11px] font-black hover:bg-blue-900/50">DUPLICAR</button>
        <button type="button" onClick={() => onArchive(p)} className="bg-gray-700/30 text-gray-300 py-3 rounded-lg text-[11px] font-black hover:bg-gray-700/50">ARCHIVAR</button>
        <button type="button" onClick={() => onDelete(p.id)} className="bg-red-900/30 text-red-500 py-3 rounded-lg text-[11px] font-black hover:bg-red-900/50">BORRAR</button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function Agente() {
  const { propiedades, setPropiedades } = usePropiedades();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  const conteo = useMemo(() => {
    return {
      venta: propiedades.filter(p => p.operacion === "Venta").length,
      alquiler: propiedades.filter(p => p.operacion === "Alquiler").length
    };
  }, [propiedades]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [fotosPrevia, setFotosPrevia] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroHab, setFiltroHab] = useState("Todos");
  const [filtroProvincia, setFiltroProvincia] = useState("Todos");
  const [filtroBanos, setFiltroBanos] = useState("Todos");

  const valoresIniciales = { titulo: "", precio: "", moneda: "DOP", tipo: "Apartamento", estado: "Disponible", operacion: "Venta", ubicacion: "", ubicacionUrl: "", habitaciones: "", banos: "", depositos: "", metrosCuadrados: "", esExtranjero: false, esNegociable: false, esExclusiva: false, detalles: "", extras: "", nombreAgente: "", parking: "", provincia: "", municipio: "", distrito: "", comision: "" };
  const [datos, setDatos] = useState(valoresIniciales);

 const propiedadesFiltradas = propiedades.filter(p => (
    (filtroTexto === "" || p.titulo?.toLowerCase().includes(filtroTexto.toLowerCase()) || p.distrito?.toLowerCase().includes(filtroTexto.toLowerCase()) || p.municipio?.toLowerCase().includes(filtroTexto.toLowerCase())) &&
    (filtroTipo === "Todos" || p.tipo === filtroTipo) &&
    (filtroHab === "Todos" || p.habitaciones?.toString() === filtroHab) &&
    (filtroProvincia === "Todos" || p.provincia === filtroProvincia) &&
    (filtroBanos === "Todos" || p.banos?.toString() === filtroBanos)
  ));

  const handleDuplicate = (p) => {
    const nuevaPropiedad = { ...p, id: Date.now(), titulo: `${p.titulo} (Copia)` };
    setPropiedades([...propiedades, nuevaPropiedad]);
  };

  const handleArchive = (p) => {
    setPropiedades(propiedades.map(item => item.id === p.id ? { ...item, estado: 'Archivada' } : item));
  };

  const manejarSeleccionFotos = async (e) => {
    const archivos = Array.from(e.target.files);
    const promesas = archivos.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
      };
    }));
    const nuevas = await Promise.all(promesas);
    setFotosPrevia(prev => [...new Set([...prev, ...nuevas])]);
    e.target.value = '';
  };

  const publicarLocal = () => {
    const nuevaPropiedad = { id: editandoId || Date.now(), ...datos, imagenes: fotosPrevia };
    if (editandoId) setPropiedades(propiedades.map(p => p.id === editandoId ? nuevaPropiedad : p));
    else setPropiedades([...propiedades, nuevaPropiedad]);
    cancelarOperacion();
  };

  const cancelarOperacion = () => {
    setDatos(valoresIniciales);
    setFotosPrevia([]);
    setModalAbierto(false);
    setEditandoId(null);
  };

  return (
    <div className="relative min-h-screen bg-[url('/mi-noche.jpg')] bg-cover bg-center bg-fixed text-white before:absolute before:inset-0 before:bg-black/50 before:backdrop-blur-[2px]">
      <Navbar />
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-black text-red-500 mb-8">PANEL DE GESTIÓN</h1>
        
        {montado && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#111] p-4 rounded-xl border border-white/10 text-center">
              <p className="text-gray-400 text-[10px] font-bold uppercase">Publicaciones en Venta</p>
              <p className="text-3xl font-black text-red-500">{conteo.venta}</p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl border border-white/10 text-center">
              <p className="text-gray-400 text-[10px] font-bold uppercase">Publicaciones en Alquiler</p>
              <p className="text-3xl font-black text-green-500">{conteo.alquiler}</p>
            </div>
          </div>
        )}

        <div className="bg-[#111]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 mb-8 sticky top-24 z-40">
           <h2 className="text-lg font-black mb-4">🔍 FILTRAR PROPIEDADES</h2>
           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
             <input className="md:col-span-2 bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-red-500" placeholder="Buscar por título, sector o municipio..." value={filtroTexto} onChange={(e) => setFiltroTexto(e.target.value)} />
             <select className="bg-black border border-white/10 p-3 rounded-xl" onChange={(e) => setFiltroProvincia(e.target.value)}>
               <option value="Todos">Provincia</option>{Object.keys(DATA_GEO).sort().map(prov => <option key={prov} value={prov}>{prov}</option>)}
             </select>
             <select className="bg-black border border-white/10 p-3 rounded-xl" onChange={(e) => setFiltroTipo(e.target.value)}>
               <option value="Todos">Tipo</option>{TIPOS_PROPIEDAD.map(t => <option key={t} value={t}>{t}</option>)}
             </select>
             <select className="bg-black border border-white/10 p-3 rounded-xl" onChange={(e) => setFiltroHab(e.target.value)}>
               <option value="Todos">Hab.</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Hab.</option>)}
             </select>
             <button onClick={() => setModalAbierto(true)} className="bg-red-600 font-bold rounded-xl hover:bg-red-700 transition-all">+ NUEVA PROPIEDAD</button>
           </div>
        </div>

        {/* AJUSTADO: Grid responsivo de 1 a 3 columnas para mayor claridad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedadesFiltradas.map((p) => (
            <TarjetaPropiedad key={p.id} p={p} onEdit={(prop) => { setEditandoId(prop.id); setDatos(prop); setFotosPrevia(prop.imagenes || []); setModalAbierto(true); }} onDelete={(id) => setPropiedades(propiedades.filter(x => x.id !== id))} onDuplicate={handleDuplicate} onArchive={handleArchive} />
          ))}
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] p-8 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/10">
            <h2 className="text-xl font-bold mb-4">{editandoId ? "Editar" : "Nueva Propiedad"}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input className="col-span-2 bg-[#1a1a1a] p-3 rounded" placeholder="Nombre del Agente" value={datos.nombreAgente || ""} onChange={e => setDatos({...datos, nombreAgente: e.target.value})} />
              <label className="flex items-center gap-2 text-[11px] font-black text-gray-300 uppercase cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={!!datos.esExclusiva} onChange={(e) => setDatos({ ...datos, esExclusiva: e.target.checked })} />
                Es Exclusiva
              </label>
            </div>
            <div className="col-span-2 space-y-2 mb-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Tipo de Operación</label>
              <div className="grid grid-cols-2 gap-2">
                {["Venta", "Alquiler"].map((op) => (
                  <button key={op} type="button" onClick={() => setDatos({ ...datos, operacion: op })} className={`py-3 rounded-lg text-sm font-black transition-all ${datos.operacion === op ? "bg-blue-600 text-white" : "bg-[#1a1a1a] text-gray-500"}`}>{op.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="bg-[#1a1a1a] p-3 rounded" placeholder="Título" value={datos.titulo || ""} onChange={e => setDatos({ ...datos, titulo: e.target.value })} />
              <div className="flex gap-2">
                <input className="flex-1 bg-[#1a1a1a] p-3 rounded" placeholder="Precio" value={datos.precio || ""} onChange={e => setDatos({ ...datos, precio: e.target.value })} />
                <select className="bg-[#1a1a1a] rounded" value={datos.moneda || "DOP"} onChange={e => setDatos({ ...datos, moneda: e.target.value })}><option>DOP</option><option>USD</option></select>
              </div>
              <div className="col-span-2 flex gap-6 my-2">
                <label className="flex items-center gap-2 text-[11px] font-black text-gray-300 uppercase cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-red-600" checked={!!datos.esNegociable} onChange={(e) => setDatos({ ...datos, esNegociable: e.target.checked })} /> Es Negociable
                </label>
                <label className="flex items-center gap-2 text-[11px] font-black text-gray-300 uppercase cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={!!datos.esExtranjero} onChange={(e) => setDatos({ ...datos, esExtranjero: e.target.checked })} /> Apto Extranjero
                </label>
              </div>
              <select className="bg-[#1a1a1a] p-3 rounded" value={datos.tipo} onChange={e => setDatos({ ...datos, tipo: e.target.value })}>{TIPOS_PROPIEDAD.map(t => <option key={t} value={t}>{t}</option>)}</select>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Estado</label>
                <div className="grid grid-cols-4 gap-2">
                  {ESTADOS.map((est) => (
                    <button key={est} type="button" onClick={() => setDatos({ ...datos, estado: est })} className={`py-2 rounded-lg text-[10px] font-black transition-all ${datos.estado === est ? "bg-red-700" : "bg-[#1a1a1a] text-gray-500"}`}>{est.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <select className="bg-[#1a1a1a] p-3 rounded" value={datos.provincia} onChange={e => setDatos({ ...datos, provincia: e.target.value, municipio: "", distrito: "" })}><option value="">Provincia</option>{Object.keys(DATA_GEO).sort().map(prov => <option key={prov} value={prov}>{prov}</option>)}</select>
              <select className="bg-[#1a1a1a] p-3 rounded" value={datos.municipio} disabled={!datos.provincia} onChange={e => setDatos({ ...datos, municipio: e.target.value, distrito: "" })}><option value="">Municipio</option>{datos.provincia && DATA_GEO[datos.provincia]?.map(mun => <option key={mun} value={mun}>{mun}</option>)}</select>
              <input className="bg-[#1a1a1a] p-3 rounded" placeholder="Distrito/Sector" value={datos.distrito || ""} onChange={e => setDatos({ ...datos, distrito: e.target.value })} />
              <input className="col-span-2 bg-[#1a1a1a] p-3 rounded" placeholder="URL Google Maps" value={datos.ubicacionUrl || ""} onChange={e => setDatos({ ...datos, ubicacionUrl: e.target.value })} />
              <input type="number" className="bg-[#1a1a1a] p-3 rounded" placeholder="Habitaciones" value={datos.habitaciones || ""} onChange={e => setDatos({ ...datos, habitaciones: e.target.value })} />
              <input type="number" className="bg-[#1a1a1a] p-3 rounded" placeholder="Baños" value={datos.banos || ""} onChange={e => setDatos({ ...datos, banos: e.target.value })} />
              <input type="number" className="bg-[#1a1a1a] p-3 rounded" placeholder="Metros Cuadrados" value={datos.metrosCuadrados || ""} onChange={e => setDatos({ ...datos, metrosCuadrados: e.target.value })} />
              <input type="number" className="bg-[#1a1a1a] p-3 rounded" placeholder="Depósitos" value={datos.depositos || ""} onChange={e => setDatos({ ...datos, depositos: e.target.value })} />
              <input className="bg-[#1a1a1a] p-3 rounded" placeholder="Parking" value={datos.parking || ""} onChange={e => setDatos({ ...datos, parking: e.target.value })} />
              <input className="bg-[#1a1a1a] p-3 rounded" placeholder="Comisión (%)" value={datos.comision || ""} onChange={e => setDatos({ ...datos, comision: e.target.value })} />
              <textarea className="col-span-2 bg-[#1a1a1a] p-3 rounded" placeholder="Descripción" value={datos.detalles || ""} onChange={e => setDatos({ ...datos, detalles: e.target.value })} />
            </div>
            <div className="my-4">
              <label className="block text-sm mb-2 font-bold text-gray-400">Fotos subidas ({fotosPrevia.length})</label>
              <input type="file" multiple onChange={manejarSeleccionFotos} className="mb-4 text-sm w-full bg-[#1a1a1a] p-2 rounded cursor-pointer" />
              <div className="grid grid-cols-4 gap-3">
                {fotosPrevia.map((foto, index) => (
                  <div key={index} className="relative aspect-square rounded overflow-hidden border border-white/10"><img src={foto} className="w-full h-full object-cover" alt="prev" /><button type="button" onClick={() => setFotosPrevia(fotosPrevia.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">×</button></div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4"><button onClick={cancelarOperacion} className="flex-1 bg-gray-700 py-3 rounded-xl font-bold">CANCELAR</button><button onClick={publicarLocal} className="flex-1 bg-red-600 py-3 rounded-xl font-bold">GUARDAR</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
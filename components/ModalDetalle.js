// components/ModalDetalle.js
import React, { useState } from 'react';

export default function ModalDetalle({ p, onClose }) {
  const [fotoIdx, setFotoIdx] = useState(0);
  const imagenes = p.imagenes || ["/placeholder.jpg"];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#111] max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl relative p-8">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-red-600 text-white w-10 h-10 rounded-full font-black">×</button>
        {/* Aquí va todo el contenido que tenías antes */}
        <div className="relative h-[400px] w-full bg-black flex items-center justify-center rounded-2xl overflow-hidden">
          <img src={imagenes[fotoIdx]} className="w-full h-full object-contain" alt={p.titulo} />
          {imagenes.length > 1 && (
            <>
              <button onClick={() => setFotoIdx(prev => (prev === 0 ? imagenes.length - 1 : prev - 1))} className="absolute left-4 bg-black/50 p-3 rounded-full text-white">◀</button>
              <button onClick={() => setFotoIdx(prev => (prev === imagenes.length - 1 ? 0 : prev + 1))} className="absolute right-4 bg-black/50 p-3 rounded-full text-white">▶</button>
            </>
          )}
        </div>
        <h2 className="text-4xl font-black text-white mt-6">{p.titulo}</h2>
        <p className="text-3xl font-black text-green-500 my-4">{p.moneda} {p.precio}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white mb-8">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">📍 {p.distrito}</div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">🛏️ {p.habitaciones} Hab.</div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5">🚗 {p.parking || "0"} Park.</div>
        </div>
        <p className="text-gray-300 mb-8">{p.detalles}</p>
        <a href={`https://wa.me/18090000000?text=Hola, interesado en: ${p.titulo}`} target="_blank" className="block w-full text-center bg-green-600 text-white font-black py-4 rounded-xl">💬 CONTACTAR POR WHATSAPP</a>
      </div>
    </div>
  );
}
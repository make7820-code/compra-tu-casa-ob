"use client";
import React, { useState } from 'react';
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ModalSolicitud({ onClose, usuario }) {
  const [formData, setFormData] = useState({
    ubicacion: '', tipoOferta: 'Cualquiera', presupuesto: '', 
    moneda: 'USD ($)', habitaciones: '1', banos: '1', parqueos: '0', telefono: '', descripcion: ''
  });

  const enviarSolicitud = async () => {
    if (!usuario) return alert("Debes iniciar sesión para hacer una solicitud");
    if (!formData.telefono) return alert("Por favor ingresa un número de teléfono");
    
    try {
      await addDoc(collection(db, "solicitudes"), {
        ...formData,
        userId: usuario.uid,
        email: usuario.email,
        createdAt: serverTimestamp(),
        estado: 'Pendiente'
      });
      alert("Solicitud enviada correctamente. Nuestros agentes te contactarán.");
      onClose();
    } catch (e) { alert("Error al enviar"); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-3xl p-8 relative">
        <h2 className="text-2xl font-bold mb-6">Nueva Solicitud de Búsqueda</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Ubicación / Zona *" placeholder="Ej. Bella Vista" onChange={(v) => setFormData({...formData, ubicacion: v})} />
          <Input label="Teléfono / WhatsApp *" placeholder="809-000-0000" onChange={(v) => setFormData({...formData, telefono: v})} />
          <Select label="Tipo de Oferta *" opciones={["Cualquiera", "Venta", "Alquiler"]} onChange={(v) => setFormData({...formData, tipoOferta: v})} />
          <Input label="Presupuesto Máximo *" placeholder="Ej. 150000" onChange={(v) => setFormData({...formData, presupuesto: v})} />
          <Select label="Moneda *" opciones={["USD ($)", "DOP ($)"]} onChange={(v) => setFormData({...formData, moneda: v})} />
          <Select label="Habitaciones *" opciones={["1", "2", "3", "4+"]} onChange={(v) => setFormData({...formData, habitaciones: v})} />
          <Select label="Baños *" opciones={["1", "2", "3", "4+"]} onChange={(v) => setFormData({...formData, banos: v})} />
          <Select label="Parqueos *" opciones={["0", "1", "2", "3+"]} onChange={(v) => setFormData({...formData, parqueos: v})} />
        </div>
        
        <textarea className="w-full bg-[#1a1a1a] p-3 rounded-lg mt-4 text-sm" placeholder="Describe lo que buscas..." onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
        
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="text-gray-400">Cancelar</button>
          <button onClick={enviarSolicitud} className="bg-blue-600 px-6 py-2 rounded-xl font-bold">Crear Solicitud</button>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, placeholder, onChange }) => (
  <div><label className="text-xs font-bold text-gray-400">{label}</label>
  <input className="w-full bg-[#1a1a1a] p-2 rounded-lg mt-1" placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /></div>
);

const Select = ({ label, opciones, onChange }) => (
  <div><label className="text-xs font-bold text-gray-400">{label}</label>
  <select className="w-full bg-[#1a1a1a] p-2.5 rounded-lg mt-1" onChange={(e) => onChange(e.target.value)}>{opciones.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
);
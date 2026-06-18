"use client";
import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function Chat({ solicitudId, usuarioId, adminId }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  useEffect(() => {
    const q = query(collection(db, `solicitudes/${solicitudId}/mensajes`), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMensajes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [solicitudId]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    await addDoc(collection(db, `solicitudes/${solicitudId}/mensajes`), {
      texto: nuevoMensaje,
      emisorId: usuarioId,
      createdAt: serverTimestamp(),
      leido: false
    });
    setNuevoMensaje("");
  };

  return (
    <div className="bg-[#111] p-4 rounded-xl border border-white/10 h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {mensajes.map((m) => (
          <div key={m.id} className={`p-2 rounded-lg text-sm ${m.emisorId === usuarioId ? 'bg-blue-600 ml-auto' : 'bg-gray-800'}`}>
            {m.texto}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-[#1a1a1a] p-2 rounded" value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)} placeholder="Escribe un mensaje..." />
        <button onClick={enviarMensaje} className="bg-blue-600 px-4 rounded">Enviar</button>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth, db, storage } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState({
    nombre: "", genero: "", nacimiento: "", telefono: "", pais: "", 
    codigoPostal: "", sector: "", fotoUrl: "", rol: ""
  });
  const fileInputRef = useRef(null);
  const router = useRouter();

  const paises = ["República Dominicana", "Venezuela", "Haití", "España", "México", "Argentina", "Colombia", "Estados Unidos", "Chile", "Otro"];
  
  const sectores = [
    "Santo Domingo Este (SDE)", "Santo Domingo Norte (SDN)", "Santo Domingo Oeste (SDO)", "Distrito Nacional",
    "Santiago de los Caballeros", "La Vega", "San Francisco de Macorís", "Puerto Plata", "Bávaro", "Punta Cana", 
    "La Romana", "San Pedro de Macorís", "Baní", "San Cristóbal"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setDatos(docSnap.data());
      } else {
        router.push("/registro");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const guardarCambios = async () => {
    await setDoc(doc(db, "usuarios", usuario.uid), datos, { merge: true });
    setEditando(false);
    alert("¡Información guardada!");
  };

  const manejarFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setDatos(prev => ({ ...prev, fotoUrl: e.target.result }));
    reader.readAsDataURL(file);

    const storageRef = ref(storage, `fotos/${usuario.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setDatos(prev => ({ ...prev, fotoUrl: url }));
    await setDoc(doc(db, "usuarios", usuario.uid), { fotoUrl: url }, { merge: true });
  };

  if (!usuario) return <div className="p-10 bg-black min-h-screen text-white">Cargando...</div>;

  return (
    <div className="relative min-h-screen w-full text-white">
      <div className="fixed inset-0 z-0">
        <Image src="/mi-portada.jpg" alt="Fondo" fill className="object-cover opacity-50" priority />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-6">Mi Perfil</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 bg-white/10 px-6 py-2 rounded-xl font-bold hover:bg-white/20 transition"
            >
              ⬅ Volver
            </button>
            <button onClick={() => editando ? guardarCambios() : setEditando(true)} className={`${editando ? "bg-green-600" : "bg-blue-600"} px-8 py-2 rounded-xl font-bold transition`}>
              {editando ? "💾 Guardar" : "✏️ Editar"}
            </button>

            {/* BOTÓN PANEL DE GESTIÓN (Solo Agentes) */}
            {datos.rol === 'agente' && (
              <Link href="/Agente" className="bg-red-600 px-6 py-2 rounded-xl font-bold hover:bg-red-700 transition flex items-center">
                ⚙️ PANEL DE GESTIÓN
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-black/40 p-8 rounded-3xl border border-white/10 text-center h-fit">
            <div className="relative w-32 h-32 mx-auto mb-4 group cursor-pointer" onClick={() => editando && fileInputRef.current.click()}>
              <img src={datos.fotoUrl || "https://ui-avatars.com/api/?name=User"} className="w-full h-full rounded-full border-4 border-blue-500/50 object-cover" />
              {editando && <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><span>📷</span></div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={manejarFoto} className="hidden" accept="image/*" />
            <h2 className="font-bold text-2xl">{datos.nombre || "Usuario"}</h2>
          </div>

          <div className="md:col-span-2 space-y-8">
            <section className="bg-black/40 p-8 rounded-3xl border border-white/10">
              <div className="grid grid-cols-2 gap-6">
                <EditableItem label="NOMBRE" campo="nombre" val={datos.nombre} editando={editando} onChange={setDatos} datos={datos} />
                
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-gray-500 font-bold">GÉNERO</p>
                  {editando ? (
                    <select className="bg-black border border-white/20 p-2 rounded-lg text-white" value={datos.genero} onChange={(e) => setDatos({...datos, genero: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                    </select>
                  ) : <p className="py-2">{datos.genero || "No especificado"}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-gray-500 font-bold">NACIMIENTO</p>
                  {editando ? (
                    <input type="date" className="bg-black border border-white/20 p-2 rounded-lg text-white w-full" value={datos.nacimiento} onChange={(e) => setDatos({...datos, nacimiento: e.target.value})} />
                  ) : <p className="py-2">{datos.nacimiento || "No especificado"}</p>}
                </div>

                <EditableItem label="TELÉFONO" campo="telefono" val={datos.telefono} editando={editando} onChange={setDatos} datos={datos} />
              </div>
            </section>

            <section className="bg-black/40 p-8 rounded-3xl border border-white/10">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-gray-500 font-bold">PAÍS</p>
                  {editando ? (
                    <select className="bg-black border border-white/20 p-2 rounded-lg text-white" value={datos.pais} onChange={(e) => setDatos({...datos, pais: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {paises.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  ) : <p className="py-2">{datos.pais || "No especificado"}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] text-gray-500 font-bold">SECTOR</p>
                  {editando ? (
                    <select className="bg-black border border-white/20 p-2 rounded-lg text-white" value={datos.sector} onChange={(e) => setDatos({...datos, sector: e.target.value})}>
                      <option value="">Seleccionar sector...</option>
                      {sectores.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : <p className="py-2">{datos.sector || "No especificado"}</p>}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableItem({ label, campo, val, editando, onChange, datos }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] text-gray-500 font-bold">{label}</p>
      {editando ? (
        <input className="bg-black border border-white/20 p-2 rounded-lg text-white" value={val || ""} onChange={(e) => onChange({...datos, [campo]: e.target.value})} />
      ) : (
        <p className="py-2">{val || "No especificado"}</p>
      )}
    </div>
  );
}
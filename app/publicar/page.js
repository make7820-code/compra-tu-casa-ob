"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function PublicarPropiedad() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  // 1. Lógica de Seguridad: Solo permite acceso si el email coincide con el tuyo
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email === "danieldecena63@gmail.com") {
        setUsuario(user);
        setCargando(false);
      } else {
        router.push("/registro"); // Si no eres tú, te saca
      }
    });
  }, [router]);

  const [datos, setDatos] = useState({
    titulo: "", precio: "", ubicacion: "", habitaciones: "", 
    banos: "", comision: "", depositos: "", agenteNombre: "", tipo: "alquiler"
  });
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("Por favor selecciona una foto");
    setEnviando(true);

    try {
      // 2. Subir imagen a Storage
      const storageRef = ref(storage, `propiedades/${Date.now()}_${archivo.name}`);
      await uploadBytes(storageRef, archivo);
      const fotoUrl = await getDownloadURL(storageRef);

      // 3. Guardar datos en Firestore
      await addDoc(collection(db, "propiedades"), { ...datos, fotoUrl, createdAt: new Date() });
      
      alert("¡Publicada correctamente!");
      router.push("/Alquiler"); // Redirige a ver la propiedad
    } catch (error) {
      console.error(error);
      alert("Error al publicar");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <p className="text-white text-center mt-20">Verificando acceso...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white/5 p-8 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-black mb-8 text-red-500">NUEVA PROPIEDAD</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input placeholder="Nombre de la propiedad" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, titulo: e.target.value})} required />
          <input type="number" placeholder="Precio ($)" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, precio: e.target.value})} required />
          <input placeholder="Ubicación exacta" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, ubicacion: e.target.value})} />
          <input type="number" placeholder="Habitaciones" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, habitaciones: e.target.value})} />
          <input type="number" placeholder="Baños" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, banos: e.target.value})} />
          <input type="number" placeholder="% Comisión" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, comision: e.target.value})} />
          <input type="number" placeholder="Cantidad de depósitos" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, depositos: e.target.value})} />
          <input placeholder="Nombre del agente" className="p-4 rounded-xl bg-white/10" onChange={(e) => setDatos({...datos, agenteNombre: e.target.value})} />
          <select className="p-4 rounded-xl bg-white/10 text-white" onChange={(e) => setDatos({...datos, tipo: e.target.value})}>
            <option value="alquiler">Alquiler</option>
            <option value="venta">Venta</option>
          </select>
          <input type="file" className="p-4 bg-white/10 rounded-xl" onChange={(e) => setArchivo(e.target.files[0])} required />
        </div>
        
        <button type="submit" disabled={enviando} className="mt-8 w-full bg-red-600 p-5 rounded-xl font-black text-xl hover:bg-red-700 transition">
          {enviando ? "Publicando..." : "Publicar Propiedad"}
        </button>
      </form>
    </div>
  );
}
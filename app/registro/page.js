"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [esRegistro, setEsRegistro] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (esRegistro) {
        // 1. Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Crear documento inicial en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
          nombre: email,
          fotoUrl: "",
          email: email,
          fechaRegistro: new Date().toISOString()
        });

        // 3. Guardar en localStorage para que el header lo detecte
        localStorage.setItem('usuario', JSON.stringify({ email: email, uid: user.uid }));
        
        alert("¡Cuenta creada con éxito!");
      } else {
        // Iniciar sesión
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Guardar en localStorage al iniciar sesión
        localStorage.setItem('usuario', JSON.stringify({ email: email, uid: userCredential.user.uid }));
        
        alert("¡Bienvenido de nuevo!");
      }
      
      // CAMBIO AQUÍ: Regresa a la página anterior en lugar de ir al inicio
      router.back(); 
      
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    // ... (Tu código JSX se mantiene exactamente igual)
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <div className="bg-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-black text-center mb-6">
          {esRegistro ? "CREAR CUENTA" : "INICIAR SESIÓN"}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="p-4 bg-gray-800 rounded-xl outline-none border border-transparent focus:border-red-600 transition" 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="p-4 bg-gray-800 rounded-xl outline-none border border-transparent focus:border-red-600 transition" 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button className="bg-red-600 text-white p-4 rounded-xl font-bold hover:bg-red-700 transition transform hover:scale-[1.02]">
            {esRegistro ? "REGISTRARME" : "ENTRAR"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {esRegistro ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
            <button 
              onClick={() => setEsRegistro(!esRegistro)}
              className="text-red-500 hover:text-red-400 font-bold transition-colors border-b border-red-500 hover:border-red-400"
            >
              {esRegistro ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
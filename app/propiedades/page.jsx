"use client";

import { useState } from "react";
import Link from "next/link";

const propiedades = [
  {
    slug: "prado-oriental",
    titulo: "Apartamento en Prado Oriental",
    precio: 14000,
    habitaciones: 1,
    tipo: "alquiler",
  },
];

export default function Propiedades() {
  const [search, setSearch] = useState("");

  const filtradas = propiedades.filter((p) =>
    p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Propiedades 🏡</h1>

      {/* BUSCADOR */}
      <input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "100%", marginTop: "10px" }}
      />

      {/* LISTA */}
      {filtradas.map((p) => (
        <div
          key={p.slug}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <h3>{p.titulo}</h3>
          <p>RD${p.precio}</p>
          <p>🛏 {p.habitaciones} habitación</p>
        </div>
      ))}
    </div>
  );
}
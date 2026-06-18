import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* FONDO (puedes cambiar a imagen o video) */}
      <img
  src="/mi-portada.jpg"
  className="absolute w-full h-full object-cover"
/>
      /<img 
  src="/tu-imagen.jpg" 
  alt="Fondo" 
  className="absolute w-full h-full object-cover" 
/>

      {/* OSCURECER FONDO */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* LOGO */}
      <div className="absolute top-6 left-6 text-white text-2xl font-bold z-10">
        COMPRA TU CASA RD
        
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">

        <h1 className="text-4xl md:text-5xl font-bold">
          ENCUENTRA TU HOGAR IDEAL
        </h1>

        <p className="mt-3 text-gray-200">
          ALQUILER Y VENTA DE PROPIEDADES
        
        </p>

        {/* BOTONES */}
        <div className="mt-6 flex gap-4 flex-col md:flex-row">

          <Link
            href="/propiedades?tipo=alquiler"
            className="bg-green-500 px-6 py-3 rounded-xl"
          >
            Quiero alquilar
          
          </Link>

          <Link
            href="/propiedades?tipo=venta"
            className="bg-blue-500 px-6 py-3 rounded-xl"
          >
            Quiero comprar
          </Link>

        </div>

      </div>
    </div>
  );
}
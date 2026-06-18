export default function Layout({ children }) {
  return (
    <div className="h-screen w-full relative bg-black">
      {/* Fondo de imagen */}
      <img src="/mi-portada.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      
      {/* Contenido que cambia */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
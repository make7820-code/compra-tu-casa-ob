export default function RedesSociales() {
  const redes = [
    { nombre: "@COMPRATUCASARD", link: "https://www.instagram.com/compra_tu_casa_rd?igsh=MTYxemk5NTR3YW0xaw==", color: "bg-pink-600", icon: "📸" },
    { nombre: "Compra Tu Casa RD", link: "https://www.facebook.com/compratucasaenrd", color: "bg-blue-600", icon: "👤" },
    { nombre: "@compratucasard", link: "https://www.tiktok.com/@compratucasaenrd", color: "bg-black", icon: "🎵" },
    { nombre: "+1 849-857-2321", link: "https://wa.me/+18498572321", color: "bg-green-600", icon: "💬" },
  ];

  return (
    <div className="fixed right-5 top-1/4 flex flex-col gap-3 z-50">
      {redes.map((item, index) => (
        <a key={index} href={item.link} target="_blank" 
           className={`${item.color} p-3 rounded-2xl flex items-center gap-3 text-white w-48 shadow-lg hover:scale-105 transition-all`}>
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs font-bold">{item.nombre}</span>
        </a>
      ))}
    </div>
  );
}

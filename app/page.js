import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100">

      <h1 className="text-4xl font-bold">
        COMPRA TU CASA OB 🏡
      </h1>

      <p className="mt-2 text-gray-600">
        Encuentra tu apartamento ideal en RD
      </p>

      <Link
        href="/propiedades"
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
      >
        Quiero mi apartamento
      </Link>

    </div>
  );
}

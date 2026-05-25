import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>COMPRA TU CASA OB 🏡</h1>

      <p>Encuentra tu apartamento ideal en República Dominicana</p>

      <Link
        href="/propiedades"
        style={{
          background: "black",
          color: "white",
          padding: "12px 20px",
          display: "inline-block",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        Quiero mi apartamento
      </Link>
    </div>
  );
}
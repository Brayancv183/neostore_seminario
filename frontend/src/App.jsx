// src/App.jsx — Raíz de la aplicación NeonStore
import { useState } from "react";
import Navbar         from "./components/Navbar.jsx";
import ProductosPage  from "./pages/ProductosPage.jsx";

/**
 * App mantiene el contador de productos del Navbar sincronizado.
 * ProductosPage es autónoma para su propio estado de carga/filtrado,
 * pero notifica a App cada vez que el total cambia mediante onTotalChange.
 */
export default function App() {
  const [totalProductos, setTotalProductos] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Syne', sans-serif" }}>
      {/* Fuentes desde Google Fonts — se pueden mover a index.html */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0a0a0f; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2e2e4e; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #a855f7; }
        select option { background: #1e1e2e; color: #f1f5f9; }
      `}</style>

      <Navbar totalProductos={totalProductos} />

      <ProductosPage onTotalChange={setTotalProductos} />
    </div>
  );
}

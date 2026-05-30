// src/components/Navbar.jsx
import { Zap } from "lucide-react";

/**
 * Navbar de NeonStore.
 * Props:
 *   totalProductos (number) — contador en tiempo real desde el padre
 */
export default function Navbar({ totalProductos = 0 }) {
  return (
    <>
      {/* ── Estilos de animación inyectados una sola vez ───────────────── */}
      <style>{`
        @keyframes neon-slide {
          0%   { transform: translateX(-100%); opacity: 0.6; }
          50%  { opacity: 1; }
          100% { transform: translateX(100%);  opacity: 0.6; }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 4px 1px rgba(168,85,247,0.8); }
          50%       { box-shadow: 0 0 10px 3px rgba(168,85,247,1);   }
        }
        .neon-line-track  { position:relative; overflow:hidden; }
        .neon-line-runner {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(168,85,247,0.7) 40%,
            rgba(6,182,212,0.9)  60%,
            transparent 100%
          );
          animation: neon-slide 3s linear infinite;
        }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e1e2e",
        }}
      >
        {/* ── Contenido principal ───────────────────────────────────────── */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                boxShadow: "0 0 16px rgba(168,85,247,0.5)",
                flexShrink: 0,
              }}
            >
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            <span
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                fontFamily: "'Orbitron', sans-serif",
                background: "linear-gradient(90deg, #a855f7, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NeonStore
            </span>
          </div>

          {/* Contador de productos */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(30,30,46,0.7)",
              border: "1px solid #2e2e4e",
              borderRadius: "999px",
              padding: "0.35rem 1rem",
            }}
          >
            {/* Dot pulsante */}
            <span
              className="pulse-dot"
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#a855f7",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontFamily: "monospace" }}>
              Productos activos
            </span>
            <span
              style={{
                color: "#a855f7",
                fontWeight: 700,
                fontSize: "1rem",
                fontFamily: "'Orbitron', sans-serif",
                minWidth: "24px",
                textAlign: "center",
              }}
            >
              {totalProductos}
            </span>
          </div>
        </div>

        {/* ── Línea neón animada ────────────────────────────────────────── */}
        <div
          className="neon-line-track"
          style={{ height: "2px", backgroundColor: "#1e1e2e" }}
        >
          <div className="neon-line-runner" />
        </div>
      </header>
    </>
  );
}

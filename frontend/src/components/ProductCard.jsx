// src/components/ProductCard.jsx
import { motion } from "framer-motion";
import { Pencil, Trash2, Package } from "lucide-react";

// ─── Estilos por categoría ────────────────────────────────────────────────────
const CATEGORIA_STYLES = {
  "Electrónica": {
    color:  "#06b6d4",
    bg:     "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.35)",
    glow:   "rgba(6,182,212,0.4)",
  },
  "Gaming": {
    color:  "#a855f7",
    bg:     "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.35)",
    glow:   "rgba(168,85,247,0.4)",
  },
  "Ropa": {
    color:  "#ec4899",
    bg:     "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.35)",
    glow:   "rgba(236,72,153,0.4)",
  },
  "Hogar": {
    color:  "#22c55e",
    bg:     "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
    glow:   "rgba(34,197,94,0.4)",
  },
  "Otros": {
    color:  "#94a3b8",
    bg:     "rgba(148,163,184,0.12)",
    border: "rgba(148,163,184,0.35)",
    glow:   "rgba(148,163,184,0.3)",
  },
};

// ─── Gradientes de placeholder por categoría ──────────────────────────────────
const PLACEHOLDER_GRADIENTS = {
  "Electrónica": "linear-gradient(135deg, #0a0a1f 0%, #0c2040 50%, #0a1a2e 100%)",
  "Gaming":      "linear-gradient(135deg, #1a0a2e 0%, #2d1060 50%, #120a20 100%)",
  "Ropa":        "linear-gradient(135deg, #1f0a18 0%, #3d1030 50%, #200a14 100%)",
  "Hogar":       "linear-gradient(135deg, #0a1f10 0%, #103d18 50%, #0a1a0e 100%)",
  "Otros":       "linear-gradient(135deg, #0f0f1a 0%, #1e1e30 50%, #0a0a14 100%)",
};

// ─── Badge de stock ───────────────────────────────────────────────────────────
function StockBadge({ stock }) {
  if (stock === 0) return null; // El badge AGOTADO lo muestra el padre

  const { color, bg, border } =
    stock <= 5
      ? { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.35)" }
      : { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.35)" };

  return (
    <div
      style={{
        display:      "inline-flex",
        alignItems:   "center",
        gap:          "0.35rem",
        padding:      "3px 10px",
        background:   bg,
        border:       `1px solid ${border}`,
        borderRadius: "999px",
        fontSize:     "0.72rem",
        fontWeight:   700,
        color,
        alignSelf:    "flex-start",
      }}
    >
      <span
        style={{
          width:           "6px",
          height:          "6px",
          borderRadius:    "50%",
          background:      color,
          boxShadow:       `0 0 5px ${color}`,
          display:         "inline-block",
          flexShrink:      0,
        }}
      />
      {stock <= 5 ? `Stock bajo · ${stock}` : `En stock · ${stock}`}
    </div>
  );
}

// ─── Estilos CSS globales (inyectados una vez) ────────────────────────────────
const CARD_STYLES = `
  @keyframes shine-move {
    from { left: -150%; }
    to   { left: 110%;  }
  }
  .neon-card-img {
    position: relative;
    overflow: hidden;
  }
  .neon-card-img::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255,255,255,0.07) 50%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }
  .neon-card-wrap:hover .neon-card-img::after {
    opacity: 1;
    animation: shine-move 0.55s ease forwards;
  }
`;

// ─── ProductCard ──────────────────────────────────────────────────────────────
export default function ProductCard({ producto, onEditar, onEliminar, index = 0 }) {
  const cat     = producto.categoria ?? "Otros";
  const style   = CATEGORIA_STYLES[cat] ?? CATEGORIA_STYLES["Otros"];
  const sinStock = (producto.stock ?? 0) === 0;

  const precioFormateado = new Intl.NumberFormat("es-CO", {
    style:                 "currency",
    currency:              "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(producto.precio);

  return (
    <>
      <style>{CARD_STYLES}</style>

      <motion.article
        className="neon-card-wrap"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: sinStock ? 0.65 : 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
        whileHover={{ scale: 1.025, transition: { duration: 0.2 } }}
        style={{
          background:    "#12121a",
          border:        "1px solid #1e1e2e",
          borderRadius:  "16px",
          overflow:      "hidden",
          display:       "flex",
          flexDirection: "column",
          boxShadow:     "0 0 20px rgba(168,85,247,0.07)",
          transition:    "border-color 0.2s, box-shadow 0.2s",
          cursor:        "default",
          position:      "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `rgba(${style.color === "#a855f7" ? "168,85,247" : style.color === "#06b6d4" ? "6,182,212" : style.color === "#ec4899" ? "236,72,153" : "168,85,247"},0.45)`;
          e.currentTarget.style.boxShadow   = `0 0 28px ${style.glow.replace("0.4","0.18")}, 0 0 60px ${style.glow.replace("0.4","0.06")}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#1e1e2e";
          e.currentTarget.style.boxShadow   = "0 0 20px rgba(168,85,247,0.07)";
        }}
      >
        {/* Badge AGOTADO */}
        {sinStock && (
          <div
            style={{
              position:     "absolute",
              top:          "12px",
              right:        "12px",
              zIndex:       5,
              background:   "rgba(239,68,68,0.9)",
              backdropFilter: "blur(4px)",
              color:        "#fff",
              fontWeight:   800,
              fontSize:     "0.68rem",
              padding:      "3px 10px",
              borderRadius: "20px",
              border:       "1px solid #f87171",
              boxShadow:    "0 0 12px rgba(239,68,68,0.6)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Agotado
          </div>
        )}

        {/* Imagen / Placeholder */}
        <div
          className="neon-card-img"
          style={{
            height:          "160px",
            background:      producto.imagen_url
              ? `url(${producto.imagen_url}) center/cover no-repeat`
              : PLACEHOLDER_GRADIENTS[cat] ?? PLACEHOLDER_GRADIENTS["Otros"],
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            flexShrink:      0,
            position:        "relative",
          }}
        >
          {!producto.imagen_url && (
            <Package size={48} color={style.color} style={{ opacity: 0.35 }} />
          )}

          {/* Badge categoría */}
          <span
            style={{
              position:      "absolute",
              top:           "10px",
              left:          "10px",
              fontSize:      "0.68rem",
              fontWeight:    700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color:         style.color,
              background:    style.bg,
              border:        `1px solid ${style.border}`,
              borderRadius:  "999px",
              padding:       "3px 10px",
              boxShadow:     `0 0 10px ${style.glow}`,
              backdropFilter: "blur(4px)",
            }}
          >
            {cat}
          </span>
        </div>

        {/* Cuerpo */}
        <div
          style={{
            padding:       "1rem 1.1rem",
            display:       "flex",
            flexDirection: "column",
            gap:           "0.5rem",
            flex:          1,
          }}
        >
          <h3
            style={{
              color:      "#f1f5f9",
              fontWeight: 700,
              fontSize:   "1rem",
              lineHeight: 1.3,
              fontFamily: "'Syne', sans-serif",
              margin:     0,
            }}
          >
            {producto.nombre}
          </h3>

          {producto.descripcion && (
            <p
              style={{
                color:              "#64748b",
                fontSize:           "0.78rem",
                lineHeight:         1.5,
                margin:             0,
                display:            "-webkit-box",
                WebkitLineClamp:    2,
                WebkitBoxOrient:    "vertical",
                overflow:           "hidden",
              }}
            >
              {producto.descripcion}
            </p>
          )}

          {/* Precio */}
          <div
            style={{
              color:      "#06b6d4",
              fontWeight: 800,
              fontSize:   "1.15rem",
              fontFamily: "'Orbitron', sans-serif",
              textShadow: "0 0 12px rgba(6,182,212,0.5)",
              marginTop:  "auto",
              paddingTop: "0.4rem",
            }}
          >
            {precioFormateado}
          </div>

          <StockBadge stock={producto.stock ?? 0} />
        </div>

        {/* Acciones */}
        <div
          style={{
            display:    "flex",
            gap:        "0.6rem",
            padding:    "0.75rem 1.1rem 1rem",
            borderTop:  "1px solid #1e1e2e",
          }}
        >
          <button
            onClick={() => onEditar?.(producto)}
            style={{
              flex:            1,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             "0.4rem",
              padding:         "0.5rem",
              background:      "transparent",
              border:          "1px solid rgba(168,85,247,0.4)",
              borderRadius:    "8px",
              color:           "#a855f7",
              fontSize:        "0.8rem",
              fontWeight:      600,
              cursor:          "pointer",
              transition:      "all 0.2s",
              fontFamily:      "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = "rgba(168,85,247,0.12)";
              e.currentTarget.style.boxShadow    = "0 0 12px rgba(168,85,247,0.3)";
              e.currentTarget.style.borderColor  = "rgba(168,85,247,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = "transparent";
              e.currentTarget.style.boxShadow    = "none";
              e.currentTarget.style.borderColor  = "rgba(168,85,247,0.4)";
            }}
          >
            <Pencil size={14} /> Editar
          </button>

          <button
            onClick={() => onEliminar?.(producto)}
            style={{
              flex:            1,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              gap:             "0.4rem",
              padding:         "0.5rem",
              background:      "transparent",
              border:          "1px solid rgba(239,68,68,0.35)",
              borderRadius:    "8px",
              color:           "#f87171",
              fontSize:        "0.8rem",
              fontWeight:      600,
              cursor:          "pointer",
              transition:      "all 0.2s",
              fontFamily:      "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = "rgba(239,68,68,0.1)";
              e.currentTarget.style.boxShadow    = "0 0 12px rgba(239,68,68,0.25)";
              e.currentTarget.style.borderColor  = "rgba(239,68,68,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = "transparent";
              e.currentTarget.style.boxShadow    = "none";
              e.currentTarget.style.borderColor  = "rgba(239,68,68,0.35)";
            }}
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </motion.article>
    </>
  );
}
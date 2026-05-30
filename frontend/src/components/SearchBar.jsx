// src/components/SearchBar.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, ChevronDown } from "lucide-react";

const CATEGORIAS = ["Todas", "Electrónica", "Ropa", "Hogar", "Gaming", "Otros"];

const CATEGORIA_COLORS = {
  "Electrónica": "#06b6d4",
  "Gaming":      "#a855f7",
  "Ropa":        "#ec4899",
  "Hogar":       "#22c55e",
  "Otros":       "#94a3b8",
  "Todas":       "#64748b",
};

/**
 * SearchBar
 * Props:
 *   onSearch (fn)   — callback({ search, categoria }) con debounce de 400ms
 *   disabled (bool)
 */
export default function SearchBar({ onSearch, disabled = false }) {
  const [input,        setInput]        = useState("");
  const [categoria,    setCategoria]    = useState("Todas");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFocused,    setIsFocused]    = useState(false);

  const timerRef   = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef   = useRef(null);
  // Evitar disparar onSearch en el montaje inicial
  const mountedRef = useRef(false);

  // ── Debounce 400ms ────────────────────────────────────────────────────────
  const dispatchSearch = useCallback(
    (search, cat) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch?.({ search, categoria: cat === "Todas" ? "" : cat });
      }, 400);
    },
    [onSearch]
  );

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    dispatchSearch(input, categoria);
    return () => clearTimeout(timerRef.current);
  }, [input, categoria, dispatchSearch]);

  // ── Cierre del dropdown al hacer clic fuera ───────────────────────────────
  useEffect(() => {
    function handler(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // FIX: limpiar() cancela el debounce y llama onSearch de inmediato,
  // en lugar de depender del useEffect que tardaría 400ms adicionales.
  function limpiar() {
    clearTimeout(timerRef.current);
    setInput("");
    setCategoria("Todas");
    onSearch?.({ search: "", categoria: "" });
    inputRef.current?.focus();
  }

  const hayFiltros = input !== "" || categoria !== "Todas";
  const colorCateg = CATEGORIA_COLORS[categoria] ?? "#64748b";

  return (
    <div
      ref={wrapperRef}
      style={{
        display:  "flex",
        gap:      "0.75rem",
        width:    "100%",
        position: "relative",
      }}
    >
      {/* ── Input de búsqueda ───────────────────────────────────────────── */}
      <div
        style={{
          flex:        1,
          position:    "relative",
          display:     "flex",
          alignItems:  "center",
          background:  "#1e1e2e",
          border:      `1px solid ${isFocused ? "#a855f7" : "#2e2e4e"}`,
          borderRadius: "12px",
          boxShadow:   isFocused ? "0 0 14px rgba(168,85,247,0.3)" : "none",
          transition:  "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <Search
          size={17}
          style={{
            position:      "absolute",
            left:          "0.9rem",
            color:         isFocused ? "#a855f7" : "#475569",
            flexShrink:    0,
            transition:    "color 0.2s",
            pointerEvents: "none",
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={input}
          placeholder="Buscar productos..."
          disabled={disabled}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex:       1,
            background: "transparent",
            border:     "none",
            outline:    "none",
            color:      "#f1f5f9",
            fontSize:   "0.9rem",
            padding:    "0.65rem 2.8rem 0.65rem 2.5rem",
            fontFamily: "inherit",
            cursor:     disabled ? "not-allowed" : "text",
          }}
        />
        {input && (
          <button
            onClick={() => setInput("")}
            style={{
              position:     "absolute",
              right:        "0.6rem",
              background:   "transparent",
              border:       "none",
              color:        "#475569",
              cursor:       "pointer",
              padding:      "0.2rem",
              display:      "flex",
              alignItems:   "center",
              borderRadius: "4px",
              transition:   "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
            title="Limpiar texto"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Dropdown de categoría ───────────────────────────────────────── */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          disabled={disabled}
          style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "0.5rem",
            padding:      "0.65rem 1rem",
            background:   dropdownOpen ? "rgba(30,30,46,0.9)" : "#1e1e2e",
            border:       `1px solid ${dropdownOpen ? colorCateg : "#2e2e4e"}`,
            borderRadius: "12px",
            color:        categoria === "Todas" ? "#94a3b8" : colorCateg,
            fontSize:     "0.85rem",
            fontWeight:   600,
            cursor:       disabled ? "not-allowed" : "pointer",
            whiteSpace:   "nowrap",
            transition:   "all 0.2s",
            boxShadow:    dropdownOpen ? `0 0 12px ${colorCateg}44` : "none",
            fontFamily:   "inherit",
          }}
        >
          <span
            style={{
              width:      "7px",
              height:     "7px",
              borderRadius: "50%",
              background: categoria === "Todas" ? "#475569" : colorCateg,
              flexShrink: 0,
              boxShadow:  categoria !== "Todas" ? `0 0 6px ${colorCateg}` : "none",
            }}
          />
          {categoria}
          <ChevronDown
            size={14}
            style={{
              transform:  dropdownOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
              opacity:    0.7,
            }}
          />
        </button>

        {dropdownOpen && (
          <div
            style={{
              position:     "absolute",
              top:          "calc(100% + 6px)",
              right:        0,
              minWidth:     "160px",
              background:   "#12121a",
              border:       "1px solid #2e2e4e",
              borderRadius: "12px",
              boxShadow:    "0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(168,85,247,0.1)",
              zIndex:       50,
              overflow:     "hidden",
              padding:      "0.35rem",
            }}
          >
            {CATEGORIAS.map((cat) => {
              const active = cat === categoria;
              const color  = CATEGORIA_COLORS[cat] ?? "#64748b";
              return (
                <button
                  key={cat}
                  onClick={() => { setCategoria(cat); setDropdownOpen(false); }}
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "0.6rem",
                    width:        "100%",
                    padding:      "0.55rem 0.85rem",
                    background:   active ? `${color}18` : "transparent",
                    border:       "none",
                    borderRadius: "8px",
                    color:        active ? color : "#94a3b8",
                    fontSize:     "0.85rem",
                    fontWeight:   active ? 700 : 400,
                    cursor:       "pointer",
                    textAlign:    "left",
                    transition:   "background 0.15s, color 0.15s",
                    fontFamily:   "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.color      = "#cbd5e1";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color      = "#94a3b8";
                    }
                  }}
                >
                  <span
                    style={{
                      width:        "7px",
                      height:       "7px",
                      borderRadius: "50%",
                      background:   active ? color : "#334155",
                      flexShrink:   0,
                      boxShadow:    active ? `0 0 6px ${color}` : "none",
                    }}
                  />
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Botón "Limpiar todo" ────────────────────────────────────────── */}
      {hayFiltros && (
        <button
          onClick={limpiar}
          title="Limpiar filtros"
          style={{
            flexShrink:   0,
            padding:      "0.65rem 0.85rem",
            background:   "rgba(239,68,68,0.08)",
            border:       "1px solid rgba(239,68,68,0.3)",
            borderRadius: "12px",
            color:        "#f87171",
            cursor:       "pointer",
            display:      "flex",
            alignItems:   "center",
            gap:          "0.3rem",
            fontSize:     "0.8rem",
            fontWeight:   600,
            transition:   "all 0.2s",
            fontFamily:   "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background  = "rgba(239,68,68,0.15)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.55)";
            e.currentTarget.style.boxShadow   = "0 0 10px rgba(239,68,68,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = "rgba(239,68,68,0.08)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            e.currentTarget.style.boxShadow   = "none";
          }}
        >
          <X size={14} />
          Limpiar
        </button>
      )}
    </div>
  );
}
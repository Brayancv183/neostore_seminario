// src/components/ProductForm.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, PackagePlus, PackageCheck } from "lucide-react";

const CATEGORIAS = ["Electrónica", "Ropa", "Hogar", "Gaming", "Otros"];

// ─── Campo wrapper reutilizable ───────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        style={{
          color:         "#94a3b8",
          fontSize:      "0.78rem",
          fontWeight:    600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: "#f87171", fontSize: "0.72rem", marginTop: "2px" }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}

// ─── Estilos base de inputs ───────────────────────────────────────────────────
const INPUT_BASE = {
  background:   "#1e1e2e",
  border:       "1px solid #2e2e4e",
  borderRadius: "8px",
  color:        "#f1f5f9",
  padding:      "0.55rem 0.85rem",
  fontSize:     "0.9rem",
  outline:      "none",
  width:        "100%",
  boxSizing:    "border-box",
  transition:   "border-color 0.2s, box-shadow 0.2s",
  fontFamily:   "inherit",
};

function NeonInput({ error, ...props }) {
  return (
    <input
      {...props}
      style={{ ...INPUT_BASE, ...(error ? { borderColor: "#f87171" } : {}) }}
      onFocus={(e) => {
        e.target.style.borderColor = "#a855f7";
        e.target.style.boxShadow   = "0 0 10px rgba(168,85,247,0.3)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? "#f87171" : "#2e2e4e";
        e.target.style.boxShadow   = "none";
      }}
    />
  );
}

function NeonTextarea({ error, ...props }) {
  return (
    <textarea
      {...props}
      style={{
        ...INPUT_BASE,
        resize:    "vertical",
        minHeight: "80px",
        ...(error ? { borderColor: "#f87171" } : {}),
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#a855f7";
        e.target.style.boxShadow   = "0 0 10px rgba(168,85,247,0.3)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? "#f87171" : "#2e2e4e";
        e.target.style.boxShadow   = "none";
      }}
    />
  );
}

function NeonSelect({ error, ...props }) {
  return (
    <select
      {...props}
      style={{
        ...INPUT_BASE,
        cursor:             "pointer",
        appearance:         "none",
        backgroundImage:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat:   "no-repeat",
        backgroundPosition: "right 0.85rem center",
        paddingRight:       "2.2rem",
        ...(error ? { borderColor: "#f87171" } : {}),
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#a855f7";
        e.target.style.boxShadow   = "0 0 10px rgba(168,85,247,0.3)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? "#f87171" : "#2e2e4e";
        e.target.style.boxShadow   = "none";
      }}
    />
  );
}

// ─── Validación ───────────────────────────────────────────────────────────────
function validar(form) {
  const errores = {};

  if (!form.nombre?.trim())
    errores.nombre = "El nombre es obligatorio";
  else if (form.nombre.trim().length > 100)
    errores.nombre = "Máximo 100 caracteres";

  if (form.precio === "" || form.precio === null || form.precio === undefined)
    errores.precio = "El precio es obligatorio";
  else if (isNaN(Number(form.precio)) || Number(form.precio) < 0)
    errores.precio = "Debe ser un número ≥ 0";

  if (form.stock !== "" && (isNaN(Number(form.stock)) || Number(form.stock) < 0))
    errores.stock = "Debe ser un entero ≥ 0";

  if (form.imagen_url && form.imagen_url.trim()) {
    try {
      new URL(form.imagen_url.trim());
    } catch {
      errores.imagen_url = "Debe ser una URL válida (https://...)";
    }
  }

  return errores;
}

// ─── Estado inicial ───────────────────────────────────────────────────────────
const FORM_INICIAL = {
  nombre:      "",
  categoria:   "Electrónica",
  precio:      "",
  stock:       "0",
  descripcion: "",
  imagen_url:  "",
};

/**
 * ProductForm — Modal de creación / edición
 * Props:
 *   abierto    (bool)         — controla visibilidad
 *   producto   (object|null)  — null = creación; objeto = edición
 *   onGuardar  (fn)           — async (datos) => void
 *   onCancelar (fn)           — cierra el modal
 */
export default function ProductForm({ abierto, producto, onGuardar, onCancelar }) {
  const [form,    setForm]    = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const modoEdicion = Boolean(producto);

  // Pre-rellenar en modo edición; limpiar al abrir en modo creación
  useEffect(() => {
    if (abierto) {
      setErrores({});
      setLoading(false);
      setForm(
        producto
          ? {
              nombre:      producto.nombre      ?? "",
              categoria:   producto.categoria   ?? "Electrónica",
              precio:      producto.precio      ?? "",
              stock:       String(producto.stock ?? 0),
              descripcion: producto.descripcion ?? "",
              imagen_url:  producto.imagen_url  ?? "",
            }
          : FORM_INICIAL
      );
    }
  }, [abierto, producto]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && abierto && !loading) onCancelar?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [abierto, loading, onCancelar]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo en cuanto el usuario empieza a corregirlo
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit() {
    const errs = validar(form);
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }
    setLoading(true);
    try {
      await onGuardar?.({
        nombre:      form.nombre.trim(),
        categoria:   form.categoria,
        precio:      Number(form.precio),
        stock:       Number(form.stock) || 0,
        descripcion: form.descripcion.trim() || null,
        imagen_url:  form.imagen_url.trim()  || null,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FIX: keyframe definido fuera del AnimatePresence para que no se elimine
          del DOM cuando el modal cierra, evitando el parpadeo del spinner */}
      <style>{`
        @keyframes form-spin {
          to { transform: rotate(360deg); }
        }
        .form-spinner {
          animation: form-spin 0.8s linear infinite;
        }
      `}</style>

      <AnimatePresence>
        {abierto && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => { if (!loading) onCancelar?.(); }}
              style={{
                position:        "fixed",
                inset:           0,
                backgroundColor: "rgba(0,0,0,0.75)",
                backdropFilter:  "blur(4px)",
                zIndex:          100,
              }}
            />

            {/* Modal
                FIX: Framer Motion combina su transform (scale + y) con cualquier
                `transform` CSS inline, por lo que translate(-50%,-50%) era pisado
                y el modal aparecía fuera de pantalla.
                Solución: div contenedor fijo centra con flexbox; motion.div solo
                anima sin necesitar ningún transform de posicionamiento. */}
            <div
              style={{
                position:       "fixed",
                inset:          0,
                zIndex:         101,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        "1rem",
                pointerEvents:  "none",
              }}
            >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9,  y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.92, y: 12  }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                pointerEvents: "all",
                position:      "relative",
                width:         "min(540px, calc(100vw - 2rem))",
                maxHeight:     "90vh",
                overflowY:     "auto",
                background:    "#12121a",
                border:        "1px solid #2e2e4e",
                borderRadius:  "18px",
                boxShadow:     "0 0 40px rgba(168,85,247,0.2), 0 24px 64px rgba(0,0,0,0.7)",
                padding:       "1.75rem",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  marginBottom:   "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div
                    style={{
                      padding:      "0.4rem",
                      background:   "rgba(168,85,247,0.15)",
                      borderRadius: "8px",
                      color:        "#a855f7",
                    }}
                  >
                    {modoEdicion ? <PackageCheck size={20} /> : <PackagePlus size={20} />}
                  </div>
                  <h2
                    style={{
                      margin:     0,
                      fontSize:   "1.15rem",
                      fontWeight: 700,
                      color:      "#f1f5f9",
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    {modoEdicion ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                </div>

                <button
                  onClick={() => { if (!loading) onCancelar?.(); }}
                  disabled={loading}
                  style={{
                    background:   "transparent",
                    border:       "1px solid #2e2e4e",
                    borderRadius: "8px",
                    color:        "#64748b",
                    cursor:       loading ? "not-allowed" : "pointer",
                    padding:      "0.3rem",
                    display:      "flex",
                    transition:   "all 0.2s",
                    opacity:      loading ? 0.4 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.color       = "#f1f5f9";
                      e.currentTarget.style.borderColor = "#4e4e6e";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color       = "#64748b";
                    e.currentTarget.style.borderColor = "#2e2e4e";
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Separador degradado */}
              <div
                style={{
                  height:       "1px",
                  background:   "linear-gradient(90deg, #a855f7, #06b6d4, transparent)",
                  marginBottom: "1.5rem",
                  opacity:      0.4,
                }}
              />

              {/* Campos */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <Field label="Nombre *" error={errores.nombre}>
                  <NeonInput
                    type="text"
                    name="nombre"
                    placeholder="Ej. NeoCortex X9 Pro"
                    value={form.nombre}
                    onChange={handleChange}
                    maxLength={100}
                    error={errores.nombre}
                    disabled={loading}
                  />
                </Field>

                <Field label="Categoría" error={errores.categoria}>
                  <NeonSelect
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c} style={{ background: "#1e1e2e", color: "#f1f5f9" }}>
                        {c}
                      </option>
                    ))}
                  </NeonSelect>
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <Field label="Precio (COP) *" error={errores.precio}>
                    <NeonInput
                      type="number"
                      name="precio"
                      placeholder="0.00"
                      value={form.precio}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      error={errores.precio}
                      disabled={loading}
                    />
                  </Field>
                  <Field label="Stock" error={errores.stock}>
                    <NeonInput
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={form.stock}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      error={errores.stock}
                      disabled={loading}
                    />
                  </Field>
                </div>

                <Field label="Descripción" error={errores.descripcion}>
                  <NeonTextarea
                    name="descripcion"
                    placeholder="Descripción del producto..."
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                    disabled={loading}
                  />
                </Field>

                <Field label="URL de imagen" error={errores.imagen_url}>
                  <NeonInput
                    type="url"
                    name="imagen_url"
                    placeholder="https://..."
                    value={form.imagen_url}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Field>
              </div>

              {/* Acciones */}
              <div
                style={{
                  display:        "flex",
                  justifyContent: "flex-end",
                  gap:            "0.75rem",
                  marginTop:      "1.75rem",
                }}
              >
                <button
                  onClick={() => { if (!loading) onCancelar?.(); }}
                  disabled={loading}
                  style={{
                    padding:      "0.6rem 1.4rem",
                    background:   "transparent",
                    border:       "1px solid #3e3e5e",
                    borderRadius: "10px",
                    color:        "#94a3b8",
                    fontWeight:   600,
                    fontSize:     "0.88rem",
                    cursor:       loading ? "not-allowed" : "pointer",
                    transition:   "all 0.2s",
                    opacity:      loading ? 0.5 : 1,
                    fontFamily:   "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor = "#6e6e8e";
                      e.currentTarget.style.color       = "#cbd5e1";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#3e3e5e";
                    e.currentTarget.style.color       = "#94a3b8";
                  }}
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    padding:        "0.6rem 1.5rem",
                    background:     loading
                      ? "linear-gradient(90deg, #581c87, #164e63)"
                      : "linear-gradient(90deg, #7c3aed, #0891b2)",
                    border:         "none",
                    borderRadius:   "10px",
                    color:          "#fff",
                    fontWeight:     700,
                    fontSize:       "0.88rem",
                    cursor:         loading ? "not-allowed" : "pointer",
                    display:        "flex",
                    alignItems:     "center",
                    gap:            "0.5rem",
                    boxShadow:      loading ? "none" : "0 0 18px rgba(168,85,247,0.4)",
                    transition:     "all 0.2s",
                    minWidth:       "130px",
                    justifyContent: "center",
                    fontFamily:     "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading)
                      e.currentTarget.style.boxShadow = "0 0 28px rgba(168,85,247,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading)
                      e.currentTarget.style.boxShadow = "0 0 18px rgba(168,85,247,0.4)";
                  }}
                >
                  {loading ? (
                    <>
                      {/* FIX: usar className con @keyframes global en lugar de style inline */}
                      <Loader2 size={16} className="form-spinner" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {modoEdicion ? "Guardar cambios" : "Crear producto"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
            </div>   {/* fin wrapper de centrado */}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
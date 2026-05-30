// src/pages/ProductosPage.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Plus, PackageX, RefreshCw,
  TrendingUp, Package, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ProductCard  from "../components/ProductCard.jsx";
import ProductForm  from "../components/ProductForm.jsx";
import SearchBar    from "../components/SearchBar.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import Toast        from "../components/Toast.jsx";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../api/productos.js";

// ════════════════════════════════════════════════════════════
//  Sub-componentes locales
// ════════════════════════════════════════════════════════════

function SkeletonCard() {
  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0%,100% { opacity:.45; }
          50%      { opacity:.9;  }
        }
        .sk { animation: skeleton-pulse 1.5s ease-in-out infinite; }
      `}</style>
      <div
        style={{
          background:   "#12121a",
          border:       "1px solid #1e1e2e",
          borderRadius: "16px",
          overflow:     "hidden",
        }}
      >
        <div className="sk" style={{ height: "160px", background: "#1e1e2e" }} />
        <div style={{ padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div className="sk" style={{ height: "14px", borderRadius: "6px", background: "#1e1e2e", width: "60%" }} />
          <div className="sk" style={{ height: "10px", borderRadius: "6px", background: "#1e1e2e", width: "90%" }} />
          <div className="sk" style={{ height: "10px", borderRadius: "6px", background: "#1e1e2e", width: "75%" }} />
          <div className="sk" style={{ height: "22px", borderRadius: "6px", background: "#1e1e2e", width: "40%", marginTop: "0.4rem" }} />
        </div>
        <div style={{ borderTop: "1px solid #1e1e2e", padding: "0.75rem 1.1rem", display: "flex", gap: "0.6rem" }}>
          <div className="sk" style={{ flex: 1, height: "32px", borderRadius: "8px", background: "#1e1e2e" }} />
          <div className="sk" style={{ flex: 1, height: "32px", borderRadius: "8px", background: "#1e1e2e" }} />
        </div>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, color, glow }) {
  return (
    <div
      style={{
        background:  "#12121a",
        border:      `1px solid ${color}28`,
        borderRadius: "14px",
        padding:     "1rem 1.25rem",
        display:     "flex",
        alignItems:  "center",
        gap:         "0.85rem",
        boxShadow:   `0 0 20px ${glow}`,
        flex:        1,
        minWidth:    0,
      }}
    >
      <div
        style={{
          padding:      "0.55rem",
          background:   `${color}18`,
          borderRadius: "10px",
          color,
          flexShrink:   0,
        }}
      >
        <Icon size={20} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color:         "#64748b",
            fontSize:      "0.72rem",
            fontWeight:    600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            color:        "#f1f5f9",
            fontWeight:   700,
            fontSize:     "1.1rem",
            fontFamily:   "'Orbitron', sans-serif",
            marginTop:    "2px",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hayFiltros, onAgregar }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        gridColumn:     "1 / -1",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "4rem 2rem",
        textAlign:      "center",
        gap:            "1.25rem",
      }}
    >
      <div
        style={{
          width:          "88px",
          height:         "88px",
          background:     "rgba(168,85,247,0.08)",
          border:         "1px solid rgba(168,85,247,0.2)",
          borderRadius:   "50%",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <PackageX size={38} color="#a855f7" style={{ opacity: 0.6 }} />
      </div>
      <div>
        <p style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "1.1rem", margin: "0 0 0.4rem" }}>
          {hayFiltros ? "Sin resultados" : "No hay productos"}
        </p>
        <p style={{ color: "#475569", fontSize: "0.85rem", margin: 0 }}>
          {hayFiltros
            ? "Prueba con otros filtros o limpia la búsqueda"
            : "Agrega tu primer producto para comenzar"}
        </p>
      </div>
      {!hayFiltros && (
        <button
          onClick={onAgregar}
          style={{
            padding:      "0.65rem 1.5rem",
            background:   "linear-gradient(90deg,#7c3aed,#0891b2)",
            border:       "none",
            borderRadius: "10px",
            color:        "#fff",
            fontWeight:   700,
            fontSize:     "0.9rem",
            cursor:       "pointer",
            display:      "flex",
            alignItems:   "center",
            gap:          "0.5rem",
            boxShadow:    "0 0 20px rgba(168,85,247,0.4)",
            fontFamily:   "inherit",
          }}
        >
          <Plus size={18} /> Agregar producto
        </button>
      )}
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
//  ProductosPage
// ════════════════════════════════════════════════════════════
export default function ProductosPage({ onTotalChange }) {
  const [productos,         setProductos]         = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(null);
  const [busqueda,          setBusqueda]          = useState("");
  const [categoriaFiltro,   setCategoriaFiltro]   = useState("");
  const [modalAbierto,      setModalAbierto]      = useState(false);
  const [productoEditando,  setProductoEditando]  = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [toast,             setToast]             = useState({ message: "", type: "info", visible: false });

  // ── Toast ────────────────────────────────────────────────
  function showToast(message, type = "info") {
    setToast({ message, type, visible: true });
  }

  // ── Cargar productos ─────────────────────────────────────
  const cargarProductos = useCallback(
    async (filtros = {}) => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await getProductos(filtros);
      if (err) {
        setError(err);
      } else {
        const lista = data?.data ?? [];
        setProductos(lista);
        onTotalChange?.(data?.total ?? lista.length);
      }
      setLoading(false);
    },
    [onTotalChange]
  );

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  // ── Búsqueda ─────────────────────────────────────────────
  const handleSearch = useCallback(
    ({ search, categoria }) => {
      setBusqueda(search ?? "");
      setCategoriaFiltro(categoria ?? "");
      cargarProductos({ search, categoria });
    },
    [cargarProductos]
  );

  // ── Modal abrir / cerrar ─────────────────────────────────
  function handleEditar(producto) {
    setProductoEditando(producto);
    setModalAbierto(true);
  }

  function handleNuevo() {
    setProductoEditando(null);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setProductoEditando(null);
  }

  // ── Guardar (crear o editar) ─────────────────────────────
  async function handleGuardar(datos) {
    const esEdicion = Boolean(productoEditando?.id);
    const { data, error: err } = esEdicion
      ? await updateProducto(productoEditando.id, datos)
      : await createProducto(datos);

    if (err) {
      showToast(err, "error");
      return;
    }

    cerrarModal();
    const nombre = data?.data?.nombre ?? datos.nombre;
    showToast(
      esEdicion ? `✓ "${nombre}" actualizado` : `✓ "${nombre}" creado`,
      "success"
    );
    cargarProductos({ search: busqueda, categoria: categoriaFiltro });
  }

  // ── Eliminar (soft delete) ───────────────────────────────
  function handleEliminar(producto) {
    setProductoAEliminar(producto);
  }

  // FIX: usamos productoAEliminar.id directamente en el handler
  // en lugar de recibirlo como parámetro (ConfirmModal llama onConfirm sin args)
  async function confirmarEliminar() {
    if (!productoAEliminar) return;
    const { id, nombre } = productoAEliminar;
    setProductoAEliminar(null);

    const { error: err } = await deleteProducto(id);
    if (err) {
      showToast(err, "error");
    } else {
      showToast(`✓ "${nombre}" desactivado`, "success");
      cargarProductos({ search: busqueda, categoria: categoriaFiltro });
    }
  }

  // ── Stats derivadas ──────────────────────────────────────
  const totalProductos  = productos.length;
  const valorInventario = productos.reduce(
    (acc, p) => acc + Number(p.precio) * Number(p.stock),
    0
  );
  const sinStock   = productos.filter((p) => (p.stock ?? 0) === 0).length;
  const hayFiltros = busqueda !== "" || categoriaFiltro !== "";

  const fmtCOP = new Intl.NumberFormat("es-CO", {
    style:                 "currency",
    currency:              "COP",
    minimumFractionDigits: 0,
  });

  // ════════════════════════════════════════════════════════════
  //  Render
  // ════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", paddingBottom: "6rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1
              style={{
                margin:                0,
                marginBottom:          "0.35rem",
                fontSize:              "clamp(1.5rem, 3vw, 2.1rem)",
                fontWeight:            800,
                fontFamily:            "'Orbitron', sans-serif",
                background:            "linear-gradient(90deg, #a855f7, #06b6d4)",
                WebkitBackgroundClip:  "text",
                WebkitTextFillColor:   "transparent",
                backgroundClip:        "text",
              }}
            >
              Gestión de Productos
            </h1>
            <p style={{ color: "#475569", fontSize: "0.88rem", margin: 0 }}>
              Administra el catálogo completo de NeonStore
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ display: "flex", gap: "1rem", marginBottom: "1.75rem", flexWrap: "wrap" }}
        >
          <StatCard
            icon={Package}
            label="Total productos"
            value={loading ? "—" : totalProductos}
            color="#a855f7"
            glow="rgba(168,85,247,0.06)"
          />
          <StatCard
            icon={TrendingUp}
            label="Valor inventario"
            value={loading ? "—" : fmtCOP.format(valorInventario)}
            color="#06b6d4"
            glow="rgba(6,182,212,0.06)"
          />
          <StatCard
            icon={AlertCircle}
            label="Sin stock"
            value={loading ? "—" : sinStock}
            color={sinStock > 0 ? "#f87171" : "#4ade80"}
            glow={sinStock > 0 ? "rgba(248,113,113,0.06)" : "rgba(74,222,128,0.06)"}
          />
        </motion.div>

        {/* SearchBar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          style={{ marginBottom: "1.75rem" }}
        >
          <SearchBar onSearch={handleSearch} disabled={loading} />
        </motion.div>

        {/* Error global */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: "1.5rem",
                background:   "rgba(239,68,68,0.08)",
                border:       "1px solid rgba(239,68,68,0.3)",
                borderRadius: "12px",
                padding:      "1rem 1.25rem",
                display:      "flex",
                alignItems:   "center",
                gap:          "0.75rem",
                color:        "#f87171",
                fontSize:     "0.88rem",
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{error}</span>
              <button
                onClick={() => cargarProductos({ search: busqueda, categoria: categoriaFiltro })}
                style={{
                  background:   "rgba(239,68,68,0.15)",
                  border:       "1px solid rgba(239,68,68,0.35)",
                  borderRadius: "8px",
                  color:        "#f87171",
                  fontSize:     "0.78rem",
                  fontWeight:   600,
                  padding:      "0.3rem 0.75rem",
                  cursor:       "pointer",
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "0.35rem",
                  fontFamily:   "inherit",
                }}
              >
                <RefreshCw size={13} /> Reintentar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid de productos */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap:                 "1.25rem",
          }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : productos.length === 0 ? (
            <EmptyState hayFiltros={hayFiltros} onAgregar={handleNuevo} />
          ) : (
            productos.map((producto, i) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                index={i}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))
          )}
        </div>
      </div>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 280, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        onClick={handleNuevo}
        title="Nuevo producto"
        style={{
          position:       "fixed",
          bottom:         "2rem",
          right:          "2rem",
          width:          "58px",
          height:         "58px",
          borderRadius:   "50%",
          background:     "linear-gradient(135deg, #7c3aed, #0891b2)",
          border:         "none",
          boxShadow:      "0 0 24px rgba(168,85,247,0.55), 0 0 60px rgba(168,85,247,0.2)",
          color:          "#fff",
          cursor:         "pointer",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          zIndex:         90,
        }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </motion.button>

      {/* Modal creación / edición */}
      <ProductForm
        abierto={modalAbierto}
        producto={productoEditando}
        onGuardar={handleGuardar}
        onCancelar={cerrarModal}
      />

      {/* Modal confirmación eliminación */}
      <ConfirmModal
        isOpen={!!productoAEliminar}
        producto={productoAEliminar}
        onConfirm={confirmarEliminar}
        onCancel={() => setProductoAEliminar(null)}
      />

      {/* Toast */}
      {toast.visible && (
        <Toast
          key={`${toast.message}-${toast.type}`}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
}
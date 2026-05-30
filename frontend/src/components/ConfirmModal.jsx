// src/components/ConfirmModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ isOpen, producto, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 200,
            }}
          />
          {/* Mismo fix que ProductForm: wrapper flexbox centra el modal,
              motion.div solo anima sin transform de posicionamiento */}
          <div
            style={{
              position:       "fixed",
              inset:          0,
              zIndex:         201,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              padding:        "1rem",
              pointerEvents:  "none",
            }}
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              pointerEvents: "all",
              position:      "relative",
              width:         "min(420px, calc(100vw - 2rem))",
              background:    "#12121a",
              border:        "1px solid rgba(239,68,68,0.4)",
              borderRadius:  "20px",
              padding:       "1.75rem",
              boxShadow: "0 0 40px rgba(239,68,68,0.2), 0 24px 64px rgba(0,0,0,0.7)",
              textAlign: "center",
            }}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                width: "64px",
                height: "64px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem",
              }}
            >
              <AlertTriangle size={32} color="#f87171" />
            </motion.div>
            <h3
              style={{
                color: "#f1f5f9",
                fontWeight: 700,
                fontSize: "1.2rem",
                margin: "0 0 0.5rem",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              ¿Eliminar producto?
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0 0 0.3rem" }}>
              El producto <strong style={{ color: "#f87171" }}>"{producto?.nombre}"</strong> será desactivado.
            </p>
            <p style={{ color: "#475569", fontSize: "0.78rem", margin: "0 0 1.5rem" }}>
              No se elimina físicamente. Puedes reactivarlo desde la base de datos.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: "0.7rem",
                  background: "transparent",
                  border: "1px solid #3e3e5e",
                  borderRadius: "12px",
                  color: "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6e6e8e";
                  e.currentTarget.style.color = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#3e3e5e";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: "0.7rem",
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.6)",
                  borderRadius: "12px",
                  color: "#f87171",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  boxShadow: "0 0 12px rgba(239,68,68,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.25)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(239,68,68,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(239,68,68,0.3)";
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </motion.div>
          </div>  {/* fin wrapper de centrado */}
        </>
      )}
    </AnimatePresence>
  );
}
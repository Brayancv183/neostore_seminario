// src/components/Toast.jsx
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const TOAST_VARIANTS = {
  success: {
    icon:   CheckCircle,
    bg:     "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.5)",
    color:  "#4ade80",
    glow:   "0 0 16px rgba(34,197,94,0.35)",
  },
  error: {
    icon:   XCircle,
    bg:     "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.5)",
    color:  "#f87171",
    glow:   "0 0 16px rgba(239,68,68,0.35)",
  },
  info: {
    icon:   Info,
    bg:     "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.5)",
    color:  "#22d3ee",
    glow:   "0 0 16px rgba(6,182,212,0.35)",
  },
};

/**
 * Toast
 * Props:
 *   message  (string)  — texto a mostrar
 *   type     (string)  — "success" | "error" | "info"
 *   duration (number)  — ms antes de auto-cerrar (default 3500)
 *   onClose  (fn)      — callback al cerrar (puede ser undefined)
 */
export default function Toast({ message, type = "info", duration = 3500, onClose }) {
  // FIX: usar ref para el timer y nunca llamar onClose si es undefined
  const timerRef = useRef(null);

  const variant = TOAST_VARIANTS[type] ?? TOAST_VARIANTS.info;
  const { icon: Icon, bg, border, color, glow } = variant;

  function close() {
    clearTimeout(timerRef.current);
    onClose?.();
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.95 }}
        animate={{ opacity: 1, x: 0,  scale: 1    }}
        exit={{   opacity: 0, x: 80, scale: 0.95  }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          position:       "fixed",
          top:            "1.5rem",
          right:          "1.5rem",
          zIndex:         1000,
          background:     bg,
          backdropFilter: "blur(12px)",
          border:         `1px solid ${border}`,
          borderRadius:   "14px",
          padding:        "0.75rem 1rem 0.75rem 1.25rem",
          display:        "flex",
          alignItems:     "center",
          gap:            "0.75rem",
          boxShadow:      glow,
          color,
          fontWeight:     600,
          fontSize:       "0.88rem",
          fontFamily:     "'Inter', sans-serif",
          maxWidth:       "360px",
          minWidth:       "240px",
        }}
      >
        <Icon size={20} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
        {/* Botón cerrar manual */}
        <button
          onClick={close}
          style={{
            background:   "transparent",
            border:       "none",
            color:        color,
            cursor:       "pointer",
            opacity:      0.6,
            padding:      "0.1rem",
            display:      "flex",
            alignItems:   "center",
            borderRadius: "4px",
            flexShrink:   0,
            transition:   "opacity 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
          aria-label="Cerrar notificación"
        >
          <X size={15} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Neón palette ──────────────────────────────────────────
        "neon-purple": {
          DEFAULT: "#a855f7",
          light:   "#c084fc",
          dark:    "#7c3aed",
          glow:    "rgba(168, 85, 247, 0.35)",
        },
        "neon-cyan": {
          DEFAULT: "#06b6d4",
          light:   "#22d3ee",
          dark:    "#0891b2",
          glow:    "rgba(6, 182, 212, 0.35)",
        },
        "neon-pink": {
          DEFAULT: "#ec4899",
          light:   "#f472b6",
          dark:    "#db2777",
          glow:    "rgba(236, 72, 153, 0.35)",
        },

        // ── Dark surfaces ─────────────────────────────────────────
        "dark-base":   "#0a0a0f",   // fondo raíz de la app
        "dark-card":   "#12121a",   // fondo de tarjetas / modales
        "dark-border": "#1e1e2e",   // bordes y separadores
        "dark-muted":  "#1a1a28",   // hover / estados secundarios
        "dark-text":   "#e2e8f0",   // texto principal
        "dark-subtle": "#64748b",   // texto secundario / placeholders
      },

      // ── Sombras neón ──────────────────────────────────────────────
      boxShadow: {
        "neon-purple": "0 0 20px rgba(168, 85, 247, 0.4), 0 0 60px rgba(168, 85, 247, 0.15)",
        "neon-cyan":   "0 0 20px rgba(6, 182, 212, 0.4),  0 0 60px rgba(6, 182, 212, 0.15)",
        "neon-pink":   "0 0 20px rgba(236, 72, 153, 0.4), 0 0 60px rgba(236, 72, 153, 0.15)",
        "card":        "0 4px 24px rgba(0, 0, 0, 0.6)",
        "card-hover":  "0 8px 40px rgba(0, 0, 0, 0.8)",
      },

      // ── Fuentes ───────────────────────────────────────────────────
      fontFamily: {
        sans:    ["'Syne'", "sans-serif"],
        display: ["'Orbitron'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },

      // ── Animaciones ───────────────────────────────────────────────
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.6" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%":                           { opacity: "0.4" },
        },
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "slide-up":   "slide-up 0.4s ease-out both",
        "flicker":    "flicker 3s linear infinite",
      },

      // ── Border radius ─────────────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      // ── Backdrop blur ─────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

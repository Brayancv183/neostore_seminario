// server.js — Punto de entrada del servidor NeonStore
import express         from "express";
import cors            from "cors";
import dotenv          from "dotenv";
import { testConnection } from "./db.js";
import productosRouter from "./routes/productos.js";

dotenv.config();

// ─── App ──────────────────────────────────────────────────────────────────────
const app  = express();
const PORT = parseInt(process.env.PORT ?? "3001", 10);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const DEFAULT_CORS_ORIGINS = ["http://localhost:5173", "http://localhost:5174"];
const CORS_ORIGINS = (process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGINS.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
    methods:     ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logger de peticiones (desarrollo) ───────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`  ${req.method.padEnd(7)} ${req.url}`);
    next();
  });
}

// ─── Rutas ────────────────────────────────────────────────────────────────────
app.use("/api/productos", productosRouter);

// Health-check — útil para balanceadores y Docker healthcheck
app.get("/api/health", (_req, res) => {
  res.json({
    status:    "ok",
    project:   "NeonStore",
    env:       process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error:  "Ruta no encontrada",
    path:   req.originalUrl,
    method: req.method,
  });
});

// ─── Error handler global ─────────────────────────────────────────────────────
// Express detecta este middleware como error handler por los 4 parámetros (err, req, res, next)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.url}`, err);

  // Errores de JSON malformado
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido en el cuerpo de la petición" });
  }

  res.status(err.status ?? 500).json({
    error:   err.message ?? "Error interno del servidor",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ─── Banner de inicio ─────────────────────────────────────────────────────────
function printBanner() {
  const line = "═".repeat(52);
  console.log(`\n  ${line}`);
  console.log(`  🟣  N E O N S T O R E  —  API Backend`);
  console.log(`  ${line}`);
  console.log(`  ► Servidor:   http://localhost:${PORT}`);
  console.log(`  ► CORS:       ${CORS_ORIGINS.join(", ")}`);
  console.log(`  ► Entorno:    ${process.env.NODE_ENV ?? "development"}`);
  console.log(`  ► Base datos: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  console.log(`  ${line}`);
  console.log(`  Endpoints disponibles:`);
  console.log(`    GET    /api/productos`);
  console.log(`    GET    /api/productos/:id`);
  console.log(`    POST   /api/productos`);
  console.log(`    PUT    /api/productos/:id`);
  console.log(`    DELETE /api/productos/:id`);
  console.log(`    GET    /api/health`);
  console.log(`  ${line}\n`);
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
  await testConnection();            // Falla rápido si MySQL no está disponible

  const server = app.listen(PORT, () => {
    printBanner();
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[NeonStore] El puerto ${PORT} ya esta en uso.`);
      console.error("[NeonStore] Cierra el proceso que lo ocupa o cambia PORT en backend/.env.");
      console.error(`[NeonStore] En PowerShell: Get-NetTCPConnection -LocalPort ${PORT} -State Listen`);
      process.exit(1);
    }

    console.error("[NeonStore] Error al iniciar el servidor:", err.message);
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  console.error("[NeonStore] Error fatal al iniciar el servidor:", err.message);
  process.exit(1);
});

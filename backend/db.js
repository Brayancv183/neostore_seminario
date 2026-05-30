// db.js — Pool de conexiones MySQL para NeonStore
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ─── Validación de variables de entorno (acepta DB_PASSWORD vacía) ─────
const required = ["DB_HOST", "DB_USER", "DB_NAME"];
const missing = [];

required.forEach(key => {
  if (!process.env[key]) {
    missing.push(key);
  }
});

// DB_PASSWORD es opcional (puede estar vacía)
if (process.env.DB_PASSWORD === undefined) {
  missing.push("DB_PASSWORD (puede estar vacía, pero debe definirse en .env)");
}

if (missing.length > 0) {
  console.error(
    `[NeonStore DB] ✖ Variables de entorno faltantes: ${missing.join(", ")}\n` +
    `  Asegúrate que el archivo .env existe en la carpeta backend/`
  );
  process.exit(1);
}

// ─── Configuración del pool ──────────────────────────────────────────────
const poolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "3306", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",  // Permitir contraseña vacía
  database: process.env.DB_NAME,
  connectionLimit: parseInt(process.env.DB_POOL_CONNECTION_LIMIT ?? "10", 10),
  queueLimit: parseInt(process.env.DB_POOL_QUEUE_LIMIT ?? "0", 10),
  waitForConnections: true,
  typeCast: true,
  timezone: "Z",
};

const pool = mysql.createPool(poolConfig);

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(
      `[NeonStore DB] ✔ Conectado a MySQL — ${process.env.DB_HOST}:${process.env.DB_PORT ?? 3306}/${process.env.DB_NAME}`
    );
    connection.release();
    return true;
  } catch (err) {
    console.error("[NeonStore DB] ✖ Error al conectar con MySQL:", err.message);
    throw err;
  }
}

export default pool;
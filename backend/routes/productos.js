// routes/productos.js — CRUD completo para la tabla `productos`
import { Router } from "express";
import pool       from "../db.js";

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Categorías válidas según el ENUM de MySQL */
const CATEGORIAS_VALIDAS = ["Electrónica", "Ropa", "Hogar", "Gaming", "Otros"];

/**
 * Extrae solo los campos editables de req.body y descarta
 * campos protegidos (id, created_at, activo — este último
 * se gestiona exclusivamente vía el endpoint de delete).
 */
function extraerCampos(body) {
  const { nombre, categoria, precio, stock, descripcion, imagen_url } = body;
  return { nombre, categoria, precio, stock, descripcion, imagen_url };
}

// ─── GET /api/productos ───────────────────────────────────────────────────────
/**
 * Retorna todos los productos activos.
 * Query params opcionales:
 *   ?categoria=Gaming          → filtra por categoría exacta
 *   ?search=phantom            → busca en nombre y descripción (LIKE)
 *   ?categoria=Gaming&search=X → combina ambos filtros
 */
router.get("/", async (req, res) => {
  try {
    const { categoria, search } = req.query;

    // Construcción dinámica de la query
    const conditions = ["activo = TRUE"];
    const params     = [];

    if (categoria) {
      if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        return res.status(400).json({
          error: `Categoría inválida. Válidas: ${CATEGORIAS_VALIDAS.join(", ")}`,
        });
      }
      conditions.push("categoria = ?");
      params.push(categoria);
    }

    if (search && search.trim() !== "") {
      conditions.push("(nombre LIKE ? OR descripcion LIKE ?)");
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    const sql = `
      SELECT
        id, nombre, categoria, precio, stock,
        descripcion, imagen_url, activo, created_at
      FROM productos
      WHERE ${conditions.join(" AND ")}
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(sql, params);

    res.json({
      total: rows.length,
      data:  rows,
    });
  } catch (err) {
    console.error("[GET /productos]", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// ─── GET /api/productos/:id ───────────────────────────────────────────────────
/**
 * Retorna un producto por su id (activo o inactivo — útil para admin).
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const [rows] = await pool.query(
      `SELECT id, nombre, categoria, precio, stock,
              descripcion, imagen_url, activo, created_at
       FROM productos
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
    }

    res.json({ data: rows[0] });
  } catch (err) {
    console.error("[GET /productos/:id]", err);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// ─── POST /api/productos ──────────────────────────────────────────────────────
/**
 * Crea un nuevo producto.
 * Body requerido: { nombre, precio }
 * Body opcional: { categoria, stock, descripcion, imagen_url }
 */
router.post("/", async (req, res) => {
  try {
    const { nombre, categoria, precio, stock, descripcion, imagen_url } = req.body;

    // ── Validaciones ────────────────────────────────────────────────────────
    const errores = [];

    if (!nombre || String(nombre).trim() === "") {
      errores.push("El campo 'nombre' es obligatorio");
    } else if (String(nombre).trim().length > 100) {
      errores.push("El campo 'nombre' no puede superar 100 caracteres");
    }

    if (precio === undefined || precio === null || precio === "") {
      errores.push("El campo 'precio' es obligatorio");
    } else if (isNaN(Number(precio)) || Number(precio) < 0) {
      errores.push("El campo 'precio' debe ser un número positivo");
    }

    if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
      errores.push(`Categoría inválida. Válidas: ${CATEGORIAS_VALIDAS.join(", ")}`);
    }

    if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
      errores.push("El campo 'stock' debe ser un entero no negativo");
    }

    if (errores.length > 0) {
      return res.status(400).json({ error: "Datos inválidos", detalles: errores });
    }

    // ── Inserción ───────────────────────────────────────────────────────────
    const [result] = await pool.query(
      `INSERT INTO productos
         (nombre, categoria, precio, stock, descripcion, imagen_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        String(nombre).trim(),
        categoria   ?? "Otros",
        Number(precio),
        stock       !== undefined ? Number(stock) : 0,
        descripcion ?? null,
        imagen_url  ?? null,
      ]
    );

    // Devolver el producto recién creado
    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      data:    rows[0],
    });
  } catch (err) {
    console.error("[POST /productos]", err);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// ─── PUT /api/productos/:id ───────────────────────────────────────────────────
/**
 * Actualiza uno o más campos de un producto existente.
 * Solo actualiza los campos presentes en el body (PATCH semántico).
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // ── Verificar que existe ────────────────────────────────────────────────
    const [existe] = await pool.query(
      "SELECT id FROM productos WHERE id = ?",
      [id]
    );
    if (existe.length === 0) {
      return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
    }

    // ── Validar campos recibidos ────────────────────────────────────────────
    const campos = extraerCampos(req.body);
    const errores = [];

    if (campos.nombre !== undefined) {
      if (String(campos.nombre).trim() === "") {
        errores.push("El campo 'nombre' no puede estar vacío");
      } else if (String(campos.nombre).trim().length > 100) {
        errores.push("El campo 'nombre' no puede superar 100 caracteres");
      }
    }

    if (campos.precio !== undefined) {
      if (isNaN(Number(campos.precio)) || Number(campos.precio) < 0) {
        errores.push("El campo 'precio' debe ser un número positivo");
      }
    }

    if (campos.categoria !== undefined && !CATEGORIAS_VALIDAS.includes(campos.categoria)) {
      errores.push(`Categoría inválida. Válidas: ${CATEGORIAS_VALIDAS.join(", ")}`);
    }

    if (campos.stock !== undefined && (isNaN(Number(campos.stock)) || Number(campos.stock) < 0)) {
      errores.push("El campo 'stock' debe ser un entero no negativo");
    }

    if (errores.length > 0) {
      return res.status(400).json({ error: "Datos inválidos", detalles: errores });
    }

    // ── Construir SET dinámico (solo campos enviados) ───────────────────────
    const setClauses = [];
    const params     = [];

    if (campos.nombre     !== undefined) { setClauses.push("nombre = ?");      params.push(String(campos.nombre).trim()); }
    if (campos.categoria  !== undefined) { setClauses.push("categoria = ?");   params.push(campos.categoria); }
    if (campos.precio     !== undefined) { setClauses.push("precio = ?");      params.push(Number(campos.precio)); }
    if (campos.stock      !== undefined) { setClauses.push("stock = ?");       params.push(Number(campos.stock)); }
    if (campos.descripcion !== undefined){ setClauses.push("descripcion = ?"); params.push(campos.descripcion ?? null); }
    if (campos.imagen_url !== undefined) { setClauses.push("imagen_url = ?");  params.push(campos.imagen_url ?? null); }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: "No se enviaron campos para actualizar" });
    }

    params.push(id);

    await pool.query(
      `UPDATE productos SET ${setClauses.join(", ")} WHERE id = ?`,
      params
    );

    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );

    res.json({
      mensaje: "Producto actualizado correctamente",
      data:    rows[0],
    });
  } catch (err) {
    console.error("[PUT /productos/:id]", err);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// ─── DELETE /api/productos/:id ────────────────────────────────────────────────
/**
 * Soft delete: cambia activo = FALSE sin eliminar el registro físicamente.
 * Retorna 404 si el producto no existe o ya estaba inactivo.
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // ── Verificar que existe y está activo ──────────────────────────────────
    const [rows] = await pool.query(
      "SELECT id, nombre, activo FROM productos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
    }

    if (!rows[0].activo) {
      return res.status(409).json({
        error: `El producto '${rows[0].nombre}' ya se encuentra inactivo`,
      });
    }

    // ── Soft delete ─────────────────────────────────────────────────────────
    await pool.query(
      "UPDATE productos SET activo = FALSE WHERE id = ?",
      [id]
    );

    res.json({
      mensaje: `Producto '${rows[0].nombre}' desactivado correctamente`,
      id:      Number(id),
    });
  } catch (err) {
    console.error("[DELETE /productos/:id]", err);
    res.status(500).json({ error: "Error al desactivar el producto" });
  }
});

export default router;

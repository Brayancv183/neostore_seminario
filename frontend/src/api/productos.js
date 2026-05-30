// src/api/productos.js
// Cliente Axios para los endpoints REST de NeonStore.
// Todas las funciones retornan { data, error } — nunca lanzan excepción.

import axios from "axios";

// ─── Instancia base ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Interceptor de respuesta — normaliza errores ──────────────────────────── 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Adjunta el mensaje del servidor al objeto de error para usarlo en los handlers
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      error.message = "No se pudo conectar con el servidor. ¿Está corriendo el backend?";
    } else if (error.code === "ECONNABORTED") {
      error.message = "La petición tardó demasiado. Intenta de nuevo.";
    }
    return Promise.reject(error);
  }
);

// ─── Wrapper genérico ─────────────────────────────────────────────────────────
async function request(fn) {
  try {
    const response = await fn();
    return { data: response.data, error: null };
  } catch (err) {
    return {
      data:  null,
      error: err.message ?? "Error desconocido",
    };
  }
}

// ─── Funciones exportadas ─────────────────────────────────────────────────────

/**
 * GET /api/productos
 * @param {{ search?: string, categoria?: string }} filtros
 */
export function getProductos(filtros = {}) {
  const params = {};
  if (filtros.search    && filtros.search.trim())    params.search    = filtros.search.trim();
  if (filtros.categoria && filtros.categoria.trim()) params.categoria = filtros.categoria.trim();
  return request(() => api.get("/api/productos", { params }));
}

/**
 * GET /api/productos/:id
 * @param {number|string} id
 */
export function getProducto(id) {
  return request(() => api.get(`/api/productos/${id}`));
}

/**
 * POST /api/productos
 * @param {object} data  — { nombre, categoria, precio, stock, descripcion?, imagen_url? }
 */
export function createProducto(data) {
  return request(() => api.post("/api/productos", data));
}

/**
 * PUT /api/productos/:id
 * @param {number|string} id
 * @param {object}        data — campos a actualizar (parcial)
 */
export function updateProducto(id, data) {
  return request(() => api.put(`/api/productos/${id}`, data));
}

/**
 * DELETE /api/productos/:id  (soft delete — cambia activo=false)
 * @param {number|string} id
 */
export function deleteProducto(id) {
  return request(() => api.delete(`/api/productos/${id}`));
}

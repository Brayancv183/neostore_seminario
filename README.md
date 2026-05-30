# 🟣 NeonStore

Sistema de registro de productos con estética **dark mode neón**.

## Stack

| Capa       | Tecnología                              |
|------------|-----------------------------------------|
| Frontend   | React 18 + Vite 5 + TailwindCSS 3       |
| Backend    | Node.js 18+ + Express 4                 |
| Base datos | MySQL 8 (driver: mysql2)                |

## Paleta de colores

| Token           | Hex       | Uso                          |
|-----------------|-----------|------------------------------|
| `neon-purple`   | `#a855f7` | Acento principal, CTAs       |
| `neon-cyan`     | `#06b6d4` | Acento secundario, links     |
| `neon-pink`     | `#ec4899` | Alertas, badges, highlights  |
| `dark-base`     | `#0a0a0f` | Fondo raíz de la app         |
| `dark-card`     | `#12121a` | Fondo de tarjetas y modales  |
| `dark-border`   | `#1e1e2e` | Bordes y separadores         |

## Estructura

```
neonstore/
├── backend/
│   ├── server.js           # Entrada del servidor Express
│   ├── db.js               # Pool de conexiones MySQL
│   ├── routes/
│   │   └── productos.js    # Rutas CRUD (próxima fase)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Vistas/páginas
│   │   ├── api/            # Clientes Axios
│   │   └── App.jsx
│   ├── tailwind.config.js  # Colores y tokens neón
│   └── package.json
├── .env.example            # Plantilla de variables de entorno
├── .gitignore
└── README.md
```

## Inicio rápido

### 1. Variables de entorno

```bash
cp .env.example backend/.env
# Edita backend/.env con tus credenciales MySQL
```

### 2. Backend

```bash
cd backend
npm install
npm run dev          # nodemon — recarga automática
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev          # Vite dev server → http://localhost:5173
```

### 4. Base de datos

```sql
CREATE DATABASE neonstore_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Scripts disponibles

| Directorio  | Comando         | Acción                        |
|-------------|-----------------|-------------------------------|
| `backend/`  | `npm run dev`   | Servidor con hot-reload        |
| `backend/`  | `npm start`     | Servidor producción            |
| `frontend/` | `npm run dev`   | Dev server Vite                |
| `frontend/` | `npm run build` | Build de producción            |
| `frontend/` | `npm run preview` | Preview del build            |

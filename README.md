# 🟣 NeonStore

<div align="center">

![NeonStore Banner](./screenshots/banner.png)

*Sistema de gestión de productos con estética dark mode y acentos neón*

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0a0f)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=0a0a0f)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white&labelColor=0a0a0f)](https://mysql.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0a0a0f)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4.18.2-ffffff?style=for-the-badge&logo=express&logoColor=white&labelColor=0a0a0f)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=0a0a0f)](https://vitejs.dev)

</div>

---

## 🎨 Aspecto Visual

NeonStore tiene una interfaz *dark mode nativa* con fondo casi negro (#0a0a0f) y tres colores de acento neón que crean profundidad y jerarquía visual:

| Color | Hex | Uso |
|---|---|---|
| 🟣 Neon Purple | #a855f7 | Acento principal, CTAs, foco de inputs |
| 🩵 Neon Cyan | #06b6d4 | Precios, acento secundario, info |
| 🩷 Neon Pink | #ec4899 | Categoría Ropa, alertas, highlights |
| 🟢 Neon Green | #22c55e | Categoría Hogar, badges de stock OK |

La interfaz incluye:
- *Glassmorphism* en la Navbar con backdrop-filter: blur(12px)
- *Glow shadows* en tarjetas y botones con box-shadow neón por categoría
- *Animaciones* con Framer Motion: fade-in escalonado en el grid, spring en modales, shimmer en skeletons
- *Tipografía tripartita*: Orbitron (display/títulos), Syne (cuerpo), JetBrains Mono (datos numéricos)
- *Línea neón animada* en la Navbar que recorre el borde con gradiente purple→cyan

---

## 📸 Capturas de pantalla

| Vista principal | Modal de creación |
|---|---|
| ![Screenshot 1](./screenshots/1.png) | ![Screenshot 2](./screenshots/2.png) |

| Confirmación de eliminación | Estado vacío / Sin resultados |
|---|---|
| ![Screenshot 3](./screenshots/3.png) | ![Screenshot 4](./screenshots/4.png) |

---

## ✨ Características

### CRUD completo de productos

- ➕ *Crear* productos con validación en tiempo real (nombre, precio obligatorios; URL de imagen validada)
- 📋 *Listar* todos los productos activos en un grid responsive con skeleton loaders durante la carga
- ✏️ *Editar* cualquier campo de un producto existente — el formulario se pre-rellena automáticamente
- 🗑️ *Eliminar* con soft delete (marca activo = FALSE sin borrar el registro físico)

### Búsqueda y filtrado

- 🔍 *Búsqueda por texto* con debounce de 400ms — busca en nombre y descripción simultáneamente
- 🏷️ *Filtro por categoría* con dropdown (Electrónica, Ropa, Hogar, Gaming, Otros)
- ❌ *Limpiar filtros* con un solo clic, disparando la recarga inmediatamente sin esperar el debounce

### UX y retroalimentación

- 🔔 *Toast notifications* para éxito y error con cierre automático y botón manual
- 💀 *Skeleton loaders* que replican la estructura exacta de las tarjetas durante la carga
- ⚠️ *Modal de confirmación* con animación de shake antes de eliminar
- 📦 *Badge de stock* — verde si hay stock, amarillo si queda poco (≤5), rojo "Agotado" si es 0
- 📊 *Panel de estadísticas* en tiempo real: total de productos, valor del inventario (precio × stock), unidades sin stock

### Backend robusto

- ✅ *Validación server-side* de todos los campos con mensajes de error descriptivos
- 🔒 *CORS configurado* vía variables de entorno
- 🏥 *Health check* en /api/health para monitoreo
- 🔄 *Hot reload* en desarrollo con nodemon
- 🛡️ *Error handler global* con stack trace solo en desarrollo

---

## 🛠️ Tech Stack

### Frontend

| Paquete | Versión | Rol |
|---|---|---|
| React | 18.2.0 | UI library |
| Vite | 5.0.0 | Bundler y dev server |
| TailwindCSS | 3.3.6 | Utilidades CSS / paleta neón |
| Framer Motion | 10.16.16 | Animaciones y transiciones |
| Axios | 1.6.2 | Cliente HTTP |
| Lucide React | 0.292.0 | Iconografía |
| Orbitron / Syne / JetBrains Mono | — | Google Fonts |

### Backend

| Paquete | Versión | Rol |
|---|---|---|
| Node.js | ≥ 18.0 | Runtime |
| Express | 4.18.2 | Framework HTTP |
| mysql2 | 3.6.5 | Driver MySQL con Promise API |
| dotenv | 16.3.1 | Variables de entorno |
| cors | 2.8.5 | CORS middleware |
| nodemon | 3.0.2 | Hot reload en desarrollo |

### Base de datos

| | |
|---|---|
| Motor | MySQL 8.0 |
| Charset | utf8mb4 / utf8mb4_unicode_ci |
| Tabla principal | productos |
| Índices | categoria, activo, nombre |

---

## 🚀 Instalación

### Prerrequisitos

- Node.js *18+* — [descargar](https://nodejs.org)
- MySQL *8.0+* corriendo localmente o en un servidor
- Git

### 1. Clonar el repositorio

bash
git clone https://github.com/tu-usuario/neonstore.git
cd neonstore


### 2. Configurar variables de entorno

bash
cp .env.example backend/.env


Edita backend/.env con tus credenciales MySQL:

env
# ── Servidor ──────────────────────────────
PORT=3001

# ── Base de datos ─────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=neonstore_db

# ── Pool de conexiones ────────────────────
DB_POOL_CONNECTION_LIMIT=10
DB_POOL_QUEUE_LIMIT=0

# ── CORS (separados por coma si son varios) ──
CORS_ORIGIN=http://localhost:5173

# ── Entorno ───────────────────────────────
NODE_ENV=development


### 3. Crear la base de datos y cargar el esquema

Conéctate a MySQL y ejecuta el script SQL:

bash
mysql -u root -p < schema.sql


O desde el cliente MySQL:

sql
SOURCE /ruta/al/proyecto/schema.sql;


Esto crea la base de datos neonstore_db, la tabla productos con sus índices y 8 productos de ejemplo.

### 4. Instalar dependencias

*Backend:*

bash
cd backend
npm install


*Frontend:*

bash
cd ../frontend
npm install


### 5. Levantar los servidores

Abre *dos terminales* en paralelo:

*Terminal 1 — Backend:*

bash
cd backend
npm run dev


Deberías ver:


  ════════════════════════════════════════════════════
  🟣  N E O N S T O R E  —  API Backend
  ════════════════════════════════════════════════════
  ► Servidor:   http://localhost:3001
  ► Entorno:    development
  ════════════════════════════════════════════════════


*Terminal 2 — Frontend:*

bash
cd frontend
npm run dev


Abre el navegador en *[http://localhost:5173](http://localhost:5173)* 🎉

---

## 📡 API Reference

Base URL: http://localhost:3001

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/productos | Listar productos activos (soporta ?search= y ?categoria=) |
| GET | /api/productos/:id | Obtener un producto por ID |
| POST | /api/productos | Crear nuevo producto |
| PUT | /api/productos/:id | Actualizar producto (campos parciales) |
| DELETE | /api/productos/:id | Soft delete (activo → false) |
| GET | /api/health | Health check del servidor |

### Ejemplo: crear producto

bash
curl -X POST http://localhost:3001/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "NeoCortex X9 Pro",
    "categoria": "Electrónica",
    "precio": 1299.99,
    "stock": 15,
    "descripcion": "Procesador cuántico de 128 núcleos"
  }'


### Categorías válidas

Electrónica · Ropa · Hogar · Gaming · Otros

---

## 📁 Estructura del proyecto


neonstore/
├── backend/
│   ├── server.js           # Punto de entrada Express
│   ├── db.js               # Pool de conexiones MySQL
│   ├── routes/
│   │   └── productos.js    # CRUD completo con validaciones
│   ├── .env                # Variables de entorno (no subir a Git)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── productos.js      # Clientes Axios (patrón { data, error })
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx  # Modal de confirmación de eliminación
│   │   │   ├── Navbar.jsx        # Header con contador de productos
│   │   │   ├── ProductCard.jsx   # Tarjeta individual de producto
│   │   │   ├── ProductForm.jsx   # Modal de creación/edición
│   │   │   ├── SearchBar.jsx     # Input + dropdown de categoría con debounce
│   │   │   └── Toast.jsx         # Notificaciones de éxito/error
│   │   ├── pages/
│   │   │   └── ProductosPage.jsx # Vista principal con estado central
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js  # Paleta neón y tokens de diseño
│   ├── vite.config.js
│   └── package.json
│
├── schema.sql              # DDL + datos de ejemplo
├── .env.example            # Plantilla de variables de entorno
├── .gitignore
└── README.md


---

## 🤖 Prompts de IA utilizados

Este proyecto fue construido con asistencia de Claude (Anthropic). A continuación, los prompts clave utilizados durante el desarrollo:

| # | Prompt (resumido) | Para qué sirvió |
|---|---|---|
| 1 | "Crea la estructura base del proyecto NeonStore: backend Express + frontend React con Vite, paleta dark mode neón, esquema MySQL de productos con categorías ENUM y datos de ejemplo" | Definió el scaffolding completo del proyecto, la paleta de colores, tokens de Tailwind, pool de conexiones MySQL y el script schema.sql con 8 productos de demo |
| 2 | "Implementa el CRUD completo de productos: rutas Express con validaciones server-side, cliente Axios con patrón { data, error }, componentes ProductCard, ProductForm, SearchBar, Navbar, Toast y ConfirmModal con estética neón" | Generó todos los archivos del frontend y el backend funcional, incluyendo debounce en la búsqueda, soft delete, skeleton loaders y el sistema de toasts |
| 3 | "Ya te envío los archivos que faltan para que implementes muchas mejoras y me ayudes a eliminar errores" (adjuntando el código fuente completo) | Auditó todos los componentes, encontró y corrigió 6 bugs críticos: ProductCard con objetos vacíos (crash), lógica rota en confirmarEliminar, spinner CSS inoperativo en ProductForm, debounce que ignoraba la limpieza, y falta de guard para onClose en Toast |
| 4 | "La carta flotante al editar o crear productos se crea fuera de la pantalla — aparece muy afuera" | Identificó la causa raíz: Framer Motion sobreescribe cualquier transform CSS inline (incluido translate(-50%,-50%)), desplazando los modales fuera de pantalla. Aplicó el fix correcto con un div contenedor flexbox en ProductForm y ConfirmModal |
| 5 | "Genera el README.md completo del proyecto NeonStore para GitHub con badges, tabla de tech stack, pasos de instalación, capturas y sección de prompts de IA" | Produjo este documento: README profesional con badges SVG, tablas de referencia, guía de instalación paso a paso, API reference y estructura del proyecto |

---

## 🐛 Bugs corregidos durante el desarrollo

| Componente | Bug | Causa | Fix aplicado |
|---|---|---|---|
| ProductCard | Crash al renderizar | CATEGORIA_STYLES, PLACEHOLDER_GRADIENTS y StockBadge estaban vacíos/sin implementar | Implementación completa de los tres |
| ProductCard | Layout roto | shine-effect con display: "contents" rompe flexbox | Reemplazado por ::after con @keyframes CSS |
| ProductosPage | Delete silencioso (nunca ejecutaba) | onConfirm llama sin argumentos; confirmarEliminar(id) recibía undefined | Lee productoAEliminar.id desde el estado |
| ProductForm | Spinner no giraba | @keyframes spin declarado dentro de AnimatePresence desaparecía al cerrar el modal | Movido fuera de AnimatePresence con nombre único form-spin |
| ProductForm / ConfirmModal | Modal fuera de pantalla | Framer Motion sobreescribe transform: translate(-50%,-50%) con su propia matriz | Wrapper div con flexbox para centrado; motion.div solo anima |
| SearchBar | "Limpiar" tardaba 400ms | limpiar() dependía del useEffect con debounce | Cancela el timer y llama onSearch de forma inmediata |
| Toast | TypeError ocasional | onClose() llamado sin verificar existencia | Reemplazado por onClose?.() en todos los puntos |

---

## 👤 Autor

<div align="center">

*Nazly Michelle Montealegre*

Estudiante de Ingeniería · FET (Fundación de Estudios Tecnológicos)

[![GitHub](https://img.shields.io/badge/GitHub-@nazly--montealegre-181717?style=for-the-badge&logo=github&labelColor=0a0a0f)](https://github.com/tu-usuario)

</div>

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos en el marco del programa de Ingeniería de la FET.

---

<div align="center">

Hecho con 🟣 y mucho neón

NeonStore — FET · 2025

</div>

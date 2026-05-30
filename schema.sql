-- ═══════════════════════════════════════════════════════════════════════════════
--  NeonStore — Script de base de datos
--  Ejecutar: mysql -u root -p < schema.sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Base de datos ────────────────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS neonstore_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE neonstore_db;

-- ─── Tabla productos ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id          INT           NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100)  NOT NULL,
  categoria   ENUM(
                'Electrónica',
                'Ropa',
                'Hogar',
                'Gaming',
                'Otros'
              )             NOT NULL DEFAULT 'Otros',
  precio      DECIMAL(10,2) NOT NULL,
  stock       INT           NOT NULL DEFAULT 0,
  descripcion TEXT,
  imagen_url  VARCHAR(255)           DEFAULT NULL,
  activo      BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_categoria (categoria),
  INDEX idx_activo    (activo),
  INDEX idx_nombre    (nombre)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ─── Datos de ejemplo ─────────────────────────────────────────────────────────
INSERT INTO productos
  (nombre, categoria, precio, stock, descripcion, imagen_url, activo)
VALUES
  (
    'NeoCortex X9 Pro',
    'Electrónica',
    1299.99,
    15,
    'Procesador cuántico de 128 núcleos con refrigeración de plasma integrada. Alcanza 9.6 GHz en modo turbo sin throttling térmico.',
    NULL,
    TRUE
  ),
  (
    'VoidRaider MK-7',
    'Gaming',
    449.00,
    32,
    'Mouse gaming de 32.000 DPI con sensor magnético de levitación. Diseño ergonómico asimétrico y RGB de espectro completo configurable por zona.',
    NULL,
    TRUE
  ),
  (
    'HoloPad Ultra 14',
    'Electrónica',
    2199.50,
    8,
    'Tablet con pantalla holográfica de 14" y stylus de retroalimentación háptica. Batería de grafeno de 72 horas de autonomía real.',
    NULL,
    TRUE
  ),
  (
    'NightCrawler Hoodie v3',
    'Ropa',
    89.95,
    60,
    'Sudadera con fibra de carbono tejida y calefacción inteligente por zonas. Resistente al agua con nanorevestimiento repelente.',
    NULL,
    TRUE
  ),
  (
    'PulseDesk NeonKit',
    'Hogar',
    349.00,
    20,
    'Kit de escritorio con LEDs RGB addressables, cargador inalámbrico integrado en la superficie y hub USB-C de 12 puertos oculto.',
    NULL,
    TRUE
  ),
  (
    'PhantomAxe Controller',
    'Gaming',
    119.99,
    45,
    'Control háptico de 8ms de latencia con gatillos adaptativos de 12 niveles de resistencia y pantalla OLED táctil en el centro.',
    NULL,
    TRUE
  ),
  (
    'CryoArc SSD 4TB',
    'Electrónica',
    279.00,
    27,
    'Unidad NVMe PCIe 5.0 con velocidades de 14.500 MB/s en lectura. Sistema de refrigeración pasiva de cobre con disipador en espiral.',
    NULL,
    TRUE
  ),
  (
    'ZenithPod Pro ANC',
    'Electrónica',
    199.00,
    50,
    'Auriculares in-ear con cancelación activa de ruido cuántica de 48dB. Drivers de grafeno de 10mm, autonomía de 40 horas y carga en 8 minutos.',
    NULL,
    TRUE
  );

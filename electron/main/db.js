import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

let db
let currentDbPath

function normalizar(str) {
  if (!str) return ''
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function getDbPath() { return currentDbPath }

export function getBackups() {
  const backupsDir = path.join(path.dirname(currentDbPath), 'backups')
  if (!fs.existsSync(backupsDir)) return []
  return fs.readdirSync(backupsDir)
    .filter(f => f.startsWith('db-') && f.endsWith('.sqlite'))
    .sort().reverse()
    .map(f => {
      const stats = fs.statSync(path.join(backupsDir, f))
      return {
        nombre: f,
        ruta: path.join(backupsDir, f),
        tamano: stats.size,
        fecha: stats.mtime.toISOString()
      }
    })
}

export function initDB(dbPath) {
  currentDbPath = dbPath
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  // Función disponible en todas las queries SQLite
  db.function('normalizar', normalizar)
  crearSchema()
  seedHabitaciones()
  return db
}

function crearSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS habitaciones (
      id        INTEGER PRIMARY KEY,
      numero    TEXT NOT NULL UNIQUE,
      planta    TEXT NOT NULL CHECK(planta IN ('baja','primera','segunda')),
      tipo      TEXT NOT NULL DEFAULT 'individual'
                      CHECK(tipo IN ('individual','doble')),
      capacidad INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS residentes (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre           TEXT NOT NULL,
      apellidos        TEXT NOT NULL,
      dni              TEXT UNIQUE,
      codigo_externo   TEXT,
      activo           INTEGER NOT NULL DEFAULT 1,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS motivos_alta (
      id     INTEGER PRIMARY KEY,
      nombre TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS ocupaciones (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      habitacion_id  INTEGER NOT NULL REFERENCES habitaciones(id),
      residente_id   INTEGER NOT NULL REFERENCES residentes(id),
      fecha_entrada  DATE NOT NULL,
      fecha_salida   DATE,
      motivo_alta_id INTEGER REFERENCES motivos_alta(id),
      notas          TEXT,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER IF NOT EXISTS ocupaciones_updated_at
    AFTER UPDATE OF fecha_salida, motivo_alta_id, notas ON ocupaciones
    FOR EACH ROW
    BEGIN
      UPDATE ocupaciones SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `)
}


// Habitaciones individuales de primera planta (resto son dobles)
const INDIVIDUALES_PRIMERA = new Set([
  // Ala sur (col izq, verdes)
  104, 107, 110, 113, 116,
  // Corredor este (fila inf, verdes)
  120, 123, 126, 129, 132, 135,
  // Ala norte (col ext, verdes)
  139, 142, 145, 148, 151, 154,
  // Corredor oeste: ninguna individual
])

function seedHabitaciones() {
  const count = db.prepare('SELECT COUNT(*) as n FROM habitaciones').get()
  if (count.n > 0) return

  const insert = db.prepare(
    'INSERT OR IGNORE INTO habitaciones (numero, planta, tipo, capacidad) VALUES (?, ?, ?, ?)'
  )

  const insertMany = db.transaction((habitaciones) => {
    for (const h of habitaciones) {
      insert.run(h.numero, h.planta, h.tipo, h.capacidad)
    }
  })

  const habitaciones = []

  // Planta Baja: 1–13 (la 13 es individual)
  for (let i = 1; i <= 13; i++) {
    const individual = i === 13
    habitaciones.push({ numero: String(i), planta: 'baja', tipo: individual ? 'individual' : 'doble', capacidad: individual ? 1 : 2 })
  }

  // Primera Planta: 101–175
  for (let i = 101; i <= 175; i++) {
    const individual = INDIVIDUALES_PRIMERA.has(i)
    habitaciones.push({ numero: String(i), planta: 'primera', tipo: individual ? 'individual' : 'doble', capacidad: individual ? 1 : 2 })
  }

  // Segunda Planta: 201–239 (individuales: 201, 227, 228)
  const INDIVIDUALES_SEGUNDA = new Set([201, 227, 228])
  for (let i = 201; i <= 239; i++) {
    const individual = INDIVIDUALES_SEGUNDA.has(i)
    habitaciones.push({ numero: String(i), planta: 'segunda', tipo: individual ? 'individual' : 'doble', capacidad: individual ? 1 : 2 })
  }

  insertMany(habitaciones)
}

// ── Habitaciones ──────────────────────────────────────────────────────────────

export function getHabitacionesConOcupacion() {
  const habitaciones = db.prepare('SELECT * FROM habitaciones ORDER BY CAST(numero AS INTEGER)').all()

  const ocupacionesActivas = db.prepare(`
    SELECT o.habitacion_id, o.id as ocupacion_id, o.fecha_entrada, o.notas,
           r.id as residente_id, r.nombre, r.apellidos, r.dni, r.codigo_externo
    FROM ocupaciones o
    JOIN residentes r ON r.id = o.residente_id
    WHERE o.fecha_salida IS NULL
  `).all()

  const mapa = {}
  for (const oc of ocupacionesActivas) {
    if (!mapa[oc.habitacion_id]) mapa[oc.habitacion_id] = []
    mapa[oc.habitacion_id].push(oc)
  }

  return habitaciones.map(h => ({
    ...h,
    ocupaciones: mapa[h.id] || []
  }))
}

export function updateHabitacion(id, { tipo, capacidad }) {
  const stmt = db.prepare('UPDATE habitaciones SET tipo = ?, capacidad = ? WHERE id = ?')
  stmt.run(tipo, capacidad, id)
}

// ── Residentes ────────────────────────────────────────────────────────────────

export function getResidentes() {
  return db.prepare(`
    SELECT r.*,
           h.numero as habitacion_numero,
           o.id as ocupacion_id,
           o.fecha_entrada,
           CASE WHEN (SELECT COUNT(*) FROM ocupaciones oc2 WHERE oc2.residente_id = r.id) = 0 THEN 1 ELSE 0 END as nunca_asignado
    FROM residentes r
    LEFT JOIN ocupaciones o ON o.residente_id = r.id AND o.fecha_salida IS NULL
    LEFT JOIN habitaciones h ON h.id = o.habitacion_id
    WHERE r.activo = 1
    ORDER BY r.apellidos, r.nombre
  `).all()
}

export function createResidente({ nombre, apellidos, dni, codigo_externo }) {
  const stmt = db.prepare(
    'INSERT INTO residentes (nombre, apellidos, dni, codigo_externo) VALUES (?, ?, ?, ?)'
  )
  const result = stmt.run(nombre, apellidos, dni || null, codigo_externo || null)
  return { id: Number(result.lastInsertRowid) }
}

export function updateResidente(id, { nombre, apellidos, dni, codigo_externo }) {
  db.prepare(
    'UPDATE residentes SET nombre = ?, apellidos = ?, dni = ?, codigo_externo = ? WHERE id = ?'
  ).run(nombre, apellidos, dni || null, codigo_externo || null, id)
}

export function deleteResidente(id) {
  const activa = db.prepare(
    'SELECT id FROM ocupaciones WHERE residente_id = ? AND fecha_salida IS NULL'
  ).get(id)
  if (activa) throw new Error('El residente tiene una ocupación activa')

  db.prepare('UPDATE residentes SET activo = 0 WHERE id = ?').run(id)
}

// ── Ocupaciones ───────────────────────────────────────────────────────────────

export function asignarResidente(habitacionId, residenteId, fechaEntrada) {
  const hab = db.prepare('SELECT * FROM habitaciones WHERE id = ?').get(habitacionId)
  if (!hab) throw new Error('Habitación no encontrada')

  const ocupacionesActivas = db.prepare(
    'SELECT COUNT(*) as n FROM ocupaciones WHERE habitacion_id = ? AND fecha_salida IS NULL'
  ).get(habitacionId)

  if (ocupacionesActivas.n >= hab.capacidad) {
    throw new Error('La habitación está completa')
  }

  const yaAsignado = db.prepare(
    'SELECT id FROM ocupaciones WHERE residente_id = ? AND fecha_salida IS NULL'
  ).get(residenteId)
  if (yaAsignado) throw new Error('El residente ya tiene una habitación asignada')

  const stmt = db.prepare(
    'INSERT INTO ocupaciones (habitacion_id, residente_id, fecha_entrada) VALUES (?, ?, ?)'
  )
  const result = stmt.run(habitacionId, residenteId, fechaEntrada)
  return { id: Number(result.lastInsertRowid) }
}

export function desasignarResidente(ocupacionId, { fechaSalida, motivoAltaId, notas }) {
  if (!motivoAltaId) throw new Error('El motivo de salida es obligatorio')

  db.prepare(`
    UPDATE ocupaciones
    SET fecha_salida = ?, motivo_alta_id = ?, notas = ?
    WHERE id = ?
  `).run(fechaSalida, motivoAltaId, notas || null, ocupacionId)
}

export function cambiarHabitacion(ocupacionId, { fecha, nuevaHabitacionId, notas }) {
  if (!fecha) throw new Error('La fecha del cambio es obligatoria')
  if (!nuevaHabitacionId) throw new Error('Selecciona la habitación destino')

  const oc = db.prepare('SELECT * FROM ocupaciones WHERE id = ? AND fecha_salida IS NULL').get(ocupacionId)
  if (!oc) throw new Error('Ocupación no encontrada o ya finalizada')

  if (oc.habitacion_id === nuevaHabitacionId) throw new Error('El residente ya está en esa habitación')

  const hab = db.prepare('SELECT * FROM habitaciones WHERE id = ?').get(nuevaHabitacionId)
  if (!hab) throw new Error('Habitación destino no encontrada')

  const ocupadasNueva = db.prepare(
    'SELECT COUNT(*) as n FROM ocupaciones WHERE habitacion_id = ? AND fecha_salida IS NULL'
  ).get(nuevaHabitacionId)
  if (ocupadasNueva.n >= hab.capacidad) throw new Error('La habitación destino está completa')

  db.transaction(() => {
    db.prepare(
      'UPDATE ocupaciones SET fecha_salida = ?, notas = ? WHERE id = ?'
    ).run(fecha, notas || null, ocupacionId)

    db.prepare(
      'INSERT INTO ocupaciones (habitacion_id, residente_id, fecha_entrada) VALUES (?, ?, ?)'
    ).run(nuevaHabitacionId, oc.residente_id, fecha)
  })()
}

// ── Motivos de alta ───────────────────────────────────────────────────────────

export function getMotivosAlta() {
  return db.prepare('SELECT * FROM motivos_alta ORDER BY id').all()
}

export function createMotivoAlta({ id, nombre }) {
  db.prepare('INSERT INTO motivos_alta (id, nombre) VALUES (?, ?)').run(id, nombre)
}

export function updateMotivoAlta(id, { nombre }) {
  db.prepare('UPDATE motivos_alta SET nombre = ? WHERE id = ?').run(nombre, id)
}

export function deleteMotivoAlta(id) {
  const usado = db.prepare(
    'SELECT id FROM ocupaciones WHERE motivo_alta_id = ? LIMIT 1'
  ).get(id)
  if (usado) throw new Error('El motivo tiene ocupaciones asociadas')
  db.prepare('DELETE FROM motivos_alta WHERE id = ?').run(id)
}

// ── Historial ─────────────────────────────────────────────────────────────────

export function getHistorial({ planta, desde, hasta, residenteId } = {}) {
  let sql = `
    SELECT o.id, o.fecha_entrada, o.fecha_salida, o.notas, o.updated_at,
           h.numero as habitacion_numero, h.planta, h.tipo,
           r.nombre, r.apellidos, r.dni, r.codigo_externo,
           m.id as motivo_id, m.nombre as motivo_nombre
    FROM ocupaciones o
    JOIN habitaciones h ON h.id = o.habitacion_id
    JOIN residentes r ON r.id = o.residente_id
    LEFT JOIN motivos_alta m ON m.id = o.motivo_alta_id
    WHERE 1=1
  `
  const params = []

  if (planta) { sql += ' AND h.planta = ?'; params.push(planta) }
  if (desde)  { sql += ' AND o.fecha_entrada >= ?'; params.push(desde) }
  if (hasta)  { sql += ' AND o.fecha_entrada <= ?'; params.push(hasta) }
  if (residenteId) { sql += ' AND o.residente_id = ?'; params.push(residenteId) }

  sql += ' ORDER BY o.fecha_entrada DESC'

  return db.prepare(sql).all(...params)
}

// ── Búsqueda ──────────────────────────────────────────────────────────────────

export function buscarPorHabitacion(numero) {
  const hab = db.prepare('SELECT * FROM habitaciones WHERE numero = ?').get(numero)
  if (!hab) return null

  const actual = db.prepare(`
    SELECT o.id as ocupacion_id, o.fecha_entrada,
           r.id as residente_id, r.nombre, r.apellidos, r.dni, r.codigo_externo
    FROM ocupaciones o
    JOIN residentes r ON r.id = o.residente_id
    WHERE o.habitacion_id = ? AND o.fecha_salida IS NULL
  `).all(hab.id)

  const historial = db.prepare(`
    SELECT o.id, o.fecha_entrada, o.fecha_salida, o.notas,
           r.nombre, r.apellidos, r.dni,
           m.nombre as motivo_nombre
    FROM ocupaciones o
    JOIN residentes r ON r.id = o.residente_id
    LEFT JOIN motivos_alta m ON m.id = o.motivo_alta_id
    WHERE o.habitacion_id = ?
    ORDER BY o.fecha_entrada DESC
  `).all(hab.id)

  return { habitacion: hab, actual, historial }
}

export function buscarPorResidente(texto) {
  const q = `%${normalizar(texto)}%`
  const residentes = db.prepare(`
    SELECT r.*,
           h.numero as habitacion_numero,
           h.planta as habitacion_planta,
           o.id as ocupacion_id,
           o.fecha_entrada
    FROM residentes r
    LEFT JOIN ocupaciones o ON o.residente_id = r.id AND o.fecha_salida IS NULL
    LEFT JOIN habitaciones h ON h.id = o.habitacion_id
    WHERE r.activo = 1
      AND (
        normalizar(r.nombre) LIKE ?
        OR normalizar(r.apellidos) LIKE ?
        OR normalizar(r.nombre || ' ' || r.apellidos) LIKE ?
      )
    ORDER BY r.apellidos, r.nombre
  `).all(q, q, q)

  return residentes.map(r => {
    const historial = db.prepare(`
      SELECT o.id, o.fecha_entrada, o.fecha_salida, o.notas,
             h.numero as habitacion_numero, h.planta,
             m.nombre as motivo_nombre
      FROM ocupaciones o
      JOIN habitaciones h ON h.id = o.habitacion_id
      LEFT JOIN motivos_alta m ON m.id = o.motivo_alta_id
      WHERE o.residente_id = ?
      ORDER BY o.fecha_entrada DESC
    `).all(r.id)
    return { ...r, historial }
  })
}

export function getHabitacionesLibres() {
  return db.prepare(`
    SELECT h.*,
           h.capacidad - IFNULL(oc.ocupadas, 0) as plazas_libres
    FROM habitaciones h
    LEFT JOIN (
      SELECT habitacion_id, COUNT(*) as ocupadas
      FROM ocupaciones
      WHERE fecha_salida IS NULL
      GROUP BY habitacion_id
    ) oc ON oc.habitacion_id = h.id
    WHERE IFNULL(oc.ocupadas, 0) < h.capacidad
    ORDER BY CAST(h.numero AS INTEGER)
  `).all()
}

// ── Insights ──────────────────────────────────────────────────────────────────

export function getInsights({ desde, hasta } = {}) {
  const hoy = new Date().toISOString().slice(0, 10)
  desde = desde || '2000-01-01'
  hasta = hasta || hoy

  // ── Métricas de estado actual (no afectadas por el filtro) ───────────────────
  const totalPlazas = db.prepare('SELECT SUM(capacidad) as total FROM habitaciones').get().total || 0
  const plazasOcupadas = db.prepare(
    'SELECT COUNT(*) as n FROM ocupaciones WHERE fecha_salida IS NULL'
  ).get().n || 0
  const plazasLibres = totalPlazas - plazasOcupadas

  const estanciaMedia = db.prepare(`
    SELECT AVG(JULIANDAY('now') - JULIANDAY(fecha_entrada)) as media
    FROM ocupaciones WHERE fecha_salida IS NULL
  `).get().media || 0

  const altasMes = db.prepare(`
    SELECT COUNT(*) as n FROM ocupaciones
    WHERE strftime('%Y-%m', fecha_salida) = strftime('%Y-%m', 'now')
  `).get().n || 0

  const porPlanta = db.prepare(`
    SELECT h.planta,
           SUM(h.capacidad) as total_plazas,
           IFNULL(SUM(oc.ocupadas), 0) as plazas_ocupadas
    FROM habitaciones h
    LEFT JOIN (
      SELECT habitacion_id, COUNT(*) as ocupadas
      FROM ocupaciones WHERE fecha_salida IS NULL
      GROUP BY habitacion_id
    ) oc ON oc.habitacion_id = h.id
    GROUP BY h.planta
  `).all()

  // ── Métricas históricas (filtradas por desde/hasta) ──────────────────────────
  const estanciaMediaHistorica = db.prepare(`
    SELECT AVG(JULIANDAY(fecha_salida) - JULIANDAY(fecha_entrada)) as media
    FROM ocupaciones WHERE fecha_salida BETWEEN ? AND ?
  `).get(desde, hasta).media || 0

  const entradas = db.prepare(`
    SELECT strftime('%Y-%m', fecha_entrada) as mes, COUNT(*) as n
    FROM ocupaciones
    WHERE fecha_entrada BETWEEN ? AND ?
    GROUP BY mes ORDER BY mes
  `).all(desde, hasta)

  const salidas = db.prepare(`
    SELECT strftime('%Y-%m', fecha_salida) as mes, COUNT(*) as n
    FROM ocupaciones
    WHERE fecha_salida BETWEEN ? AND ?
    GROUP BY mes ORDER BY mes
  `).all(desde, hasta)

  const motivosSalida = db.prepare(`
    SELECT m.id, m.nombre, COUNT(o.id) as total
    FROM motivos_alta m
    JOIN ocupaciones o ON o.motivo_alta_id = m.id
    WHERE o.fecha_salida BETWEEN ? AND ?
    GROUP BY m.id
    ORDER BY total DESC
  `).all(desde, hasta)

  const distribucionEstancias = db.prepare(`
    SELECT
      SUM(CASE WHEN dias < 30 THEN 1 ELSE 0 END) as menos_30,
      SUM(CASE WHEN dias >= 30 AND dias < 180 THEN 1 ELSE 0 END) as uno_seis_meses,
      SUM(CASE WHEN dias >= 180 AND dias < 365 THEN 1 ELSE 0 END) as seis_doce_meses,
      SUM(CASE WHEN dias >= 365 THEN 1 ELSE 0 END) as mas_anio
    FROM (
      SELECT JULIANDAY(fecha_salida) - JULIANDAY(fecha_entrada) as dias
      FROM ocupaciones WHERE fecha_salida BETWEEN ? AND ?
    )
  `).get(desde, hasta)

  const evolucion = db.prepare(`
    WITH RECURSIVE meses(mes) AS (
      SELECT strftime('%Y-%m', ?)
      UNION ALL
      SELECT strftime('%Y-%m', date(mes || '-01', '+1 month'))
      FROM meses WHERE mes < strftime('%Y-%m', ?)
    )
    SELECT m.mes,
      (SELECT COUNT(*) FROM ocupaciones o
       WHERE o.fecha_entrada <= (m.mes || '-31')
         AND (o.fecha_salida IS NULL OR o.fecha_salida > (m.mes || '-01'))
      ) as ocupados
    FROM meses m
    ORDER BY mes
  `).all(desde, hasta)

  return {
    totalPlazas,
    plazasOcupadas,
    plazasLibres,
    estanciaMedia: Math.round(estanciaMedia),
    estanciaMediaHistorica: Math.round(estanciaMediaHistorica),
    altasMes,
    porPlanta,
    entradas,
    salidas,
    motivosSalida,
    distribucionEstancias,
    evolucion,
    filtro: { desde, hasta }
  }
}

// ── Exportación Excel ─────────────────────────────────────────────────────────

export function getDatosExcel() {
  const estadoActual = db.prepare(`
    SELECT h.numero as habitacion, h.planta, h.tipo,
           r.nombre, r.apellidos, r.dni, r.codigo_externo,
           o.fecha_entrada
    FROM habitaciones h
    LEFT JOIN ocupaciones o ON o.habitacion_id = h.id AND o.fecha_salida IS NULL
    LEFT JOIN residentes r ON r.id = o.residente_id
    ORDER BY CAST(h.numero AS INTEGER)
  `).all()

  const historial = db.prepare(`
    SELECT h.numero as habitacion, r.nombre, r.apellidos, r.dni, r.codigo_externo,
           o.fecha_entrada, o.fecha_salida, m.nombre as motivo_alta, o.notas
    FROM ocupaciones o
    JOIN habitaciones h ON h.id = o.habitacion_id
    JOIN residentes r ON r.id = o.residente_id
    LEFT JOIN motivos_alta m ON m.id = o.motivo_alta_id
    ORDER BY CAST(h.numero AS INTEGER), o.fecha_entrada DESC
  `).all()

  const libres = getHabitacionesLibres()

  return { estadoActual, historial, libres }
}

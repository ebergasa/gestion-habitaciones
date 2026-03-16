#!/usr/bin/env node
/**
 * seed-demo.cjs
 *
 * Borra la base de datos y carga datos sintéticos para pruebas:
 *   - 127 habitaciones (con tipos y capacidades reales)
 *   - 6 motivos de alta
 *   - 550 residentes con nombres españoles aleatorios
 *   - ~2 años de historial de ocupaciones (mar 2024 → mar 2026)
 *
 * Uso:  node scripts/seed-demo.cjs
 *
 * Genera un fichero SQL y lo ejecuta con el CLI sqlite3 del sistema,
 * evitando problemas de versión con el módulo better-sqlite3 de Electron.
 */

'use strict'

const { execSync }  = require('child_process')
const path          = require('path')
const fs            = require('fs')
const os            = require('os')
const readline      = require('readline')

const DB_PATH  = path.join(
  __dirname,
  '../node_modules/electron/dist/Electron.app/Contents/MacOS/gestion-habitaciones.sqlite'
)
const SQL_FILE = path.join(os.tmpdir(), 'seed-demo.sql')

// ── Pools de nombres ────────────────────────────────────────────────────────
const NOMBRES = [
  'María','Carmen','Josefa','Isabel','Ana','Laura','Cristina','Marta','Sara','Elena',
  'Rosa','Antonia','Francisca','Dolores','Pilar','Teresa','Concepción','Manuela','Luisa','Paula',
  'Rosario','Mercedes','Amparo','Encarnación','Milagros','Inmaculada','Remedios','Sofía','Beatriz','Patricia',
  'Alicia','Natalia','Raquel','Silvia','Nuria','Gloria','Eva','Inés','Yolanda','Verónica',
  'José','Antonio','Manuel','Francisco','Juan','David','Javier','Carlos','Miguel','Pedro',
  'Ángel','Jesús','Alejandro','Fernando','Diego','Rafael','Luis','Jorge','Alberto','Sergio',
  'Ramón','Emilio','Enrique','Eduardo','Ignacio','Alfonso','Víctor','Roberto','Andrés','Pablo',
  'Tomás','Agustín','Gregorio','Domingo','Felipe','Lorenzo','Marcos','Nicolás','Raimundo','Salvador',
  'Leandro','Valentín','Cipriano','Esteban','Germán','Teodoro','Celestino','Eugenio','Isidro','Blas',
]

const APELLIDOS = [
  'García','Martínez','López','Sánchez','González','Pérez','Rodríguez','Fernández','Torres','Ramírez',
  'Flores','Moreno','Jiménez','Ruiz','Hernández','Díaz','Vázquez','Álvarez','Romero','Navarro',
  'Serrano','Molina','Blanco','Suárez','Castro','Ortega','Rubio','Gutiérrez','Delgado','Cabrera',
  'Herrera','Medina','Vega','Ramos','Muñoz','Iglesias','Pardo','Domínguez','Aguilar','Montoya',
  'Campos','Gallego','Bravo','Gil','Peña','León','Guerrero','Prieto','Cano','Lara',
  'Mendoza','Reyes','Cortés','Fuentes','Vargas','Castillo','Nieto','Ibáñez','Moya','Benítez',
  'Rojas','Crespo','Pascual','Hidalgo','Mora','Velasco','Acosta','Cruz','Santos','Núñez',
  'Calvo','Marín','Soto','Carrasco','Lorenzo','Vidal','Méndez','Alonso','Marco','Carmona',
  'Marín','Expósito','Pereira','Simón','Caballero','Garrido','Fuente','Durán','Sierra','Luque',
]

const MOTIVOS = [
  'Fallecimiento',
  'Alta voluntaria',
  'Traslado a otro centro',
  'Cambio de habitación',
  'Alta médica',
  'Traslado familiar',
]

const NOTAS_POOL = [
  'Sin incidencias al alta.',
  'Familia notificada.',
  'Documentación entregada en mano.',
  'Pendiente de liquidación.',
  'Se llevó todos sus efectos personales.',
  'Requirió asistencia médica al alta.',
  'Proceso de alta sin complicaciones.',
  '','','','','',  // mayor peso a notas vacías
]

// ── Utilidades ──────────────────────────────────────────────────────────────
function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function esc(str) {
  // Escapa comillas simples para SQL
  return str == null ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`
}

function randomStayDays() {
  const r = Math.random()
  if (r < 0.15) return randInt(14, 45)
  if (r < 0.70) return randInt(60, 300)
  return randInt(300, 600)
}

// ── Definición de habitaciones ───────────────────────────────────────────────
const INDIVIDUALES_PRIMERA = new Set([104,107,110,113,116,120,123,126,129,132,135,139,142,145,148,151,154])
const INDIVIDUALES_SEGUNDA = new Set([201,227,228])

function buildHabitaciones() {
  const list = []
  for (let i = 1; i <= 13; i++) {
    const ind = i === 13
    list.push({ numero: String(i), planta: 'baja', tipo: ind ? 'individual' : 'doble', capacidad: ind ? 1 : 2 })
  }
  for (let i = 101; i <= 175; i++) {
    const ind = INDIVIDUALES_PRIMERA.has(i)
    list.push({ numero: String(i), planta: 'primera', tipo: ind ? 'individual' : 'doble', capacidad: ind ? 1 : 2 })
  }
  for (let i = 201; i <= 239; i++) {
    const ind = INDIVIDUALES_SEGUNDA.has(i)
    list.push({ numero: String(i), planta: 'segunda', tipo: ind ? 'individual' : 'doble', capacidad: ind ? 1 : 2 })
  }
  return list
}

// ── Generación de residentes ─────────────────────────────────────────────────
function generarResidentes(n) {
  const usados = new Set()
  const list   = []
  for (let i = 0; i < n; i++) {
    let nombre, apellidos, key
    let intentos = 0
    do {
      nombre    = pick(NOMBRES)
      apellidos = `${pick(APELLIDOS)} ${pick(APELLIDOS)}`
      key = `${nombre}|${apellidos}`
      intentos++
    } while (usados.has(key) && intentos < 20)
    usados.add(key)

    const conDni    = Math.random() < 0.80
    const letras    = 'TRWAGMYFPDXBNJZSQVHLCKE'
    const numDni    = randInt(10000000, 99999999)
    const dni       = conDni ? `${numDni}${letras[numDni % 23]}` : null
    const codigo    = Math.random() < 0.65 ? `R${String(i + 1).padStart(4, '0')}` : null

    list.push({ nombre, apellidos, dni, codigo_externo: codigo })
  }
  return list
}

// ── Generación del historial de un slot de habitación ───────────────────────
function generarSlot(inicio, fin) {
  const ocupaciones = []
  let cursor = inicio

  while (cursor < fin) {
    const duracion = randomStayDays()
    const salida   = addDays(cursor, duracion)

    if (salida >= fin) {
      const activa = Math.random() < 0.55
      ocupaciones.push({
        entrada:   cursor,
        salida:    activa ? null : fin,
        motivoId:  activa ? null : randInt(1, MOTIVOS.length),
        notas:     activa ? '' : pick(NOTAS_POOL),
      })
      break
    }

    ocupaciones.push({
      entrada:  cursor,
      salida,
      motivoId: randInt(1, MOTIVOS.length),
      notas:    pick(NOTAS_POOL),
    })

    const gap = Math.random() < 0.30 ? 0 : randInt(1, 60)
    cursor = addDays(salida, gap)
  }

  return ocupaciones
}

// ── Confirmación interactiva ─────────────────────────────────────────────────
function confirmar(pregunta) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl.question(pregunta, respuesta => {
      rl.close()
      resolve(respuesta.trim().toLowerCase())
    })
  })
}

// ── Main ─────────────────────────────────────────────────────────────────────
;(async function main() {
  const INICIO       = '2024-03-16'
  const HOY          = '2026-03-16'
  const N_RESIDENTES = 550

  console.log('\n⚠️  ADVERTENCIA')
  console.log('   Este script eliminará PERMANENTEMENTE la base de datos actual:')
  console.log(`   ${DB_PATH}`)
  console.log('   y la sustituirá por datos sintéticos de prueba.\n')

  const respuesta = await confirmar('   ¿Deseas continuar? Escribe "si" para confirmar: ')

  if (respuesta !== 'si') {
    console.log('\nOperación cancelada. La base de datos no ha sido modificada.\n')
    process.exit(0)
  }

  console.log('\nGenerando datos sintéticos…')

  const habitaciones = buildHabitaciones()
  const residentes   = generarResidentes(N_RESIDENTES)

  // Asignar IDs secuenciales a los residentes (AUTOINCREMENT empieza en 1)
  residentes.forEach((r, i) => { r.id = i + 1 })

  // Construir todas las ocupaciones
  let resIdx = 0
  const ocupaciones = []

  for (let hi = 0; hi < habitaciones.length; hi++) {
    const hab   = habitaciones[hi]
    const habId = hi + 1  // IDs empiezan en 1
    const slots = hab.capacidad

    for (let slot = 0; slot < slots; slot++) {
      const desfase = Math.random() < 0.70 ? randInt(0, 90) : randInt(90, 200)
      const inicio  = addDays(INICIO, desfase)
      if (inicio >= HOY) continue

      const slotOcupaciones = generarSlot(inicio, HOY)
      for (const oc of slotOcupaciones) {
        const res = residentes[resIdx % residentes.length]
        resIdx++
        ocupaciones.push({
          habitacionId: habId,
          residenteId:  res.id,
          entrada:      oc.entrada,
          salida:       oc.salida,
          motivoId:     oc.motivoId,
          notas:        oc.notas,
        })
      }
    }
  }

  // ── Construir SQL ──────────────────────────────────────────────────────────
  const lines = []

  lines.push('PRAGMA journal_mode = WAL;')
  lines.push('PRAGMA foreign_keys = ON;')
  lines.push('BEGIN;')

  // Schema
  lines.push(`
CREATE TABLE habitaciones (
  id        INTEGER PRIMARY KEY,
  numero    TEXT NOT NULL UNIQUE,
  planta    TEXT NOT NULL CHECK(planta IN ('baja','primera','segunda')),
  tipo      TEXT NOT NULL DEFAULT 'individual' CHECK(tipo IN ('individual','doble')),
  capacidad INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE residentes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre           TEXT NOT NULL,
  apellidos        TEXT NOT NULL,
  dni              TEXT UNIQUE,
  codigo_externo   TEXT,
  activo           INTEGER NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE motivos_alta (
  id     INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);
CREATE TABLE ocupaciones (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  habitacion_id  INTEGER NOT NULL REFERENCES habitaciones(id),
  residente_id   INTEGER NOT NULL REFERENCES residentes(id),
  fecha_entrada  DATE NOT NULL,
  fecha_salida   DATE,
  motivo_alta_id INTEGER REFERENCES motivos_alta(id),
  notas          TEXT,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);`)

  // Habitaciones
  for (let i = 0; i < habitaciones.length; i++) {
    const h = habitaciones[i]
    lines.push(`INSERT INTO habitaciones VALUES (${i+1},${esc(h.numero)},${esc(h.planta)},${esc(h.tipo)},${h.capacidad});`)
  }

  // Motivos
  MOTIVOS.forEach((m, i) => {
    lines.push(`INSERT INTO motivos_alta VALUES (${i+1},${esc(m)});`)
  })

  // Residentes
  for (const r of residentes) {
    lines.push(`INSERT INTO residentes (nombre,apellidos,dni,codigo_externo) VALUES (${esc(r.nombre)},${esc(r.apellidos)},${esc(r.dni)},${esc(r.codigo_externo)});`)
  }

  // Ocupaciones
  for (const oc of ocupaciones) {
    lines.push(
      `INSERT INTO ocupaciones (habitacion_id,residente_id,fecha_entrada,fecha_salida,motivo_alta_id,notas) VALUES (${oc.habitacionId},${oc.residenteId},${esc(oc.entrada)},${esc(oc.salida)},${oc.motivoId ?? 'NULL'},${esc(oc.notas || null)});`
    )
  }

  lines.push('COMMIT;')

  // ── Escribir y ejecutar SQL ───────────────────────────────────────────────
  fs.writeFileSync(SQL_FILE, lines.join('\n'), 'utf8')

  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
    console.log('✓ BD anterior eliminada')
  }

  execSync(`sqlite3 "${DB_PATH}" < "${SQL_FILE}"`)
  fs.unlinkSync(SQL_FILE)

  // ── Resumen ───────────────────────────────────────────────────────────────
  const activas  = ocupaciones.filter(o => !o.salida).length
  const cerradas = ocupaciones.filter(o =>  o.salida).length

  console.log('\n── Resumen ────────────────────────────────')
  console.log(`   Habitaciones : ${habitaciones.length}`)
  console.log(`   Motivos alta : ${MOTIVOS.length}`)
  console.log(`   Residentes   : ${residentes.length}`)
  console.log(`   Ocupaciones  : ${ocupaciones.length}  (${activas} activas, ${cerradas} históricas)`)
  console.log(`   BD           : ${DB_PATH}`)
  console.log('───────────────────────────────────────────\n')
})()

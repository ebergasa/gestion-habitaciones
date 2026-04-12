/**
 * Importa residentes y ocupaciones desde residentes_habitaciones_nombre_formato.xlsx
 *
 * Transformación de números de habitación: restar 100
 *   101-112  →  1-12   (planta baja)
 *   201-271  →  101-171 (primera planta)
 *   301-338  →  201-238 (segunda planta)
 *
 * Uso:
 *   node scripts/importar-residentes.cjs           <- dry-run (solo muestra)
 *   node scripts/importar-residentes.cjs --import  <- importa de verdad
 */

const ExcelJS  = require('exceljs')
const { DatabaseSync } = require('node:sqlite')
const path     = require('path')

const DRY_RUN   = !process.argv.includes('--import')
const XLSX_PATH = path.join(__dirname, '..', 'residentes_habitaciones_nombre_formato.xlsx')
const DB_PATH   = path.join(
  __dirname, '..', 'node_modules/electron/dist/Electron.app/Contents/MacOS/gestion-habitaciones.sqlite'
)

async function main() {
  // ── Leer Excel ──────────────────────────────────────────────────────────────
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(XLSX_PATH, { ignoreNodes: ['tableParts', 'extLst'] })
  const sheet = wb.getWorksheet('residentes')

  const filas = []
  sheet.eachRow((row, i) => {
    if (i === 1) return  // cabecera
    const nombre       = (row.getCell(1).value || '').toString().trim()
    const apellidos    = (row.getCell(2).value || '').toString().trim()
    const fechaRaw     = row.getCell(3).value
    const habOriginal  = Number(row.getCell(4).value)

    if (!nombre && !apellidos) return  // fila vacía

    const habTransformada = habOriginal - 100
    const fechaEntrada    = fechaRaw
      ? new Date(fechaRaw).toISOString().slice(0, 10)
      : null

    filas.push({ nombre, apellidos, fechaEntrada, habOriginal, habTransformada })
  })

  // ── Abrir BD ────────────────────────────────────────────────────────────────
  const db = new DatabaseSync(DB_PATH)
  db.exec('PRAGMA foreign_keys = ON')

  const habitaciones = db.prepare('SELECT id, numero FROM habitaciones').all()
  const habPorNumero = {}
  for (const h of habitaciones) habPorNumero[h.numero] = h.id

  // ── Analizar ────────────────────────────────────────────────────────────────
  const advertencias = []
  const ok = []

  for (const f of filas) {
    const habId = habPorNumero[String(f.habTransformada)]
    if (!habId) {
      advertencias.push(`Habitación ${f.habOriginal} → ${f.habTransformada} NO existe en la BD — omitida (${f.apellidos}, ${f.nombre})`)
      continue
    }
    if (!f.fechaEntrada) {
      f.fechaEntrada = new Date().toISOString().slice(0, 10)
      advertencias.push(`Sin fecha: ${f.apellidos}, ${f.nombre} (hab ${f.habTransformada}) — se usará ${f.fechaEntrada}`)
    }
    ok.push({ ...f, habId })
  }

  // ── Mostrar resumen ─────────────────────────────────────────────────────────
  console.log(`\nTotal filas en Excel : ${filas.length}`)
  console.log(`A importar           : ${ok.length}`)
  console.log(`Advertencias         : ${advertencias.length}`)
  if (advertencias.length) {
    console.log('\n── Advertencias ──')
    advertencias.forEach(a => console.log(' ⚠', a))
  }

  console.log('\n── Muestra (primeras 10) ──')
  ok.slice(0, 10).forEach(f =>
    console.log(` Hab ${String(f.habTransformada).padStart(3)} | ${f.fechaEntrada} | ${f.apellidos}, ${f.nombre}`)
  )

  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Nada se ha escrito. Ejecuta con --import para importar.')
    db.close()
    return
  }

  // ── Importar ────────────────────────────────────────────────────────────────
  const insertResidente = db.prepare(
    'INSERT INTO residentes (nombre, apellidos) VALUES (?, ?)'
  )
  const insertOcupacion = db.prepare(
    'INSERT INTO ocupaciones (habitacion_id, residente_id, fecha_entrada) VALUES (?, ?, ?)'
  )

  db.exec('BEGIN')
  try {
    for (const f of ok) {
      const { lastInsertRowid } = insertResidente.run(f.nombre, f.apellidos)
      insertOcupacion.run(f.habId, Number(lastInsertRowid), f.fechaEntrada)
    }
    db.exec('COMMIT')
  } catch (e) {
    db.exec('ROLLBACK')
    throw e
  }

  console.log(`\n✓ Importados ${ok.length} residentes con sus ocupaciones.`)
  db.close()
}

main().catch(e => { console.error('Error:', e.message); process.exit(1) })

import { ipcMain, dialog } from 'electron'
import { readFileSync } from 'fs'
import ExcelJS from 'exceljs'
import * as db from './db.js'
import * as config from './config.js'

// Envuelve cada handler para que los errores se relancen como Error estándar
// (Electron no puede serializar SqliteError ni otras subclases de Error por IPC)
function h(fn) {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (e) {
      throw new Error(e.message ?? String(e))
    }
  }
}

export function registerHandlers() {
  // ── Configuración (nombre + logo) ─────────────────────────────────────────
  ipcMain.handle('getConfig', h(() => config.getConfig()))

  ipcMain.handle('setNombreResidencia', h((_, nombre) => config.setNombreResidencia(nombre)))

  ipcMain.handle('seleccionarLogo', h(async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Seleccionar logotipo',
      filters: [{ name: 'Imágenes', extensions: ['svg', 'png', 'jpg', 'jpeg', 'webp'] }],
      properties: ['openFile']
    })
    if (canceled || !filePaths.length) return null
    const filePath = filePaths[0]
    const buffer = readFileSync(filePath)
    const ext = filePath.split('.').pop().toLowerCase()
    const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`
    const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`
    config.setLogo(dataUrl)
    return dataUrl
  }))

  ipcMain.handle('deleteLogo', h(() => config.deleteLogo()))

  // ── Habitaciones ──────────────────────────────────────────────────────────
  ipcMain.handle('getHabitacionesConOcupacion', h(() => db.getHabitacionesConOcupacion()))
  ipcMain.handle('updateHabitacion', h((_, id, data) => db.updateHabitacion(id, data)))

  // ── Residentes ────────────────────────────────────────────────────────────
  ipcMain.handle('getResidentes', h(() => db.getResidentes()))
  ipcMain.handle('createResidente', h((_, data) => db.createResidente(data)))
  ipcMain.handle('updateResidente', h((_, id, data) => db.updateResidente(id, data)))
  ipcMain.handle('deleteResidente', h((_, id) => db.deleteResidente(id)))

  // ── Ocupaciones ───────────────────────────────────────────────────────────
  ipcMain.handle('asignarResidente', h((_, habitacionId, residenteId, fechaEntrada) =>
    db.asignarResidente(habitacionId, residenteId, fechaEntrada)))
  ipcMain.handle('desasignarResidente', h((_, ocupacionId, data) =>
    db.desasignarResidente(ocupacionId, data)))

  // ── Motivos de alta ───────────────────────────────────────────────────────
  ipcMain.handle('getMotivosAlta', h(() => db.getMotivosAlta()))
  ipcMain.handle('createMotivoAlta', h((_, data) => db.createMotivoAlta(data)))
  ipcMain.handle('updateMotivoAlta', h((_, id, data) => db.updateMotivoAlta(id, data)))
  ipcMain.handle('deleteMotivoAlta', h((_, id) => db.deleteMotivoAlta(id)))

  // ── Historial ─────────────────────────────────────────────────────────────
  ipcMain.handle('getHistorial', h((_, filtros) => db.getHistorial(filtros)))

  // ── Búsqueda ──────────────────────────────────────────────────────────────
  ipcMain.handle('buscarPorHabitacion', h((_, numero) => db.buscarPorHabitacion(numero)))
  ipcMain.handle('buscarPorResidente', h((_, texto) => db.buscarPorResidente(texto)))
  ipcMain.handle('getHabitacionesLibres', h(() => db.getHabitacionesLibres()))

  // ── Insights ──────────────────────────────────────────────────────────────
  ipcMain.handle('getInsights', h(() => db.getInsights()))

  // ── Exportación Excel ─────────────────────────────────────────────────────
  ipcMain.handle('seleccionarRutaExcel', async () => {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Guardar Excel',
      defaultPath: `gestion-habitaciones-${new Date().toISOString().slice(0,10)}.xlsx`,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    })
    return filePath || null
  })

  ipcMain.handle('exportarExcel', async (_, rutaDestino) => {
    const { estadoActual, historial, libres } = db.getDatosExcel()

    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Gestión de Habitaciones'

    // ── Hoja 1: Estado actual ───────────────────────────────────────────────
    const hojaActual = workbook.addWorksheet('Estado actual')
    hojaActual.columns = [
      { header: 'Habitación', key: 'habitacion', width: 12 },
      { header: 'Planta', key: 'planta', width: 14 },
      { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Residente', key: 'residente', width: 28 },
      { header: 'DNI', key: 'dni', width: 12 },
      { header: 'Cód. Residente', key: 'codigo_externo', width: 14 },
      { header: 'Fecha entrada', key: 'fecha_entrada', width: 14 }
    ]
    estiloCabecera(hojaActual)
    for (const row of estadoActual) {
      hojaActual.addRow({
        habitacion: row.habitacion,
        planta: capitalizarPlanta(row.planta),
        tipo: row.tipo,
        residente: row.nombre ? `${row.apellidos}, ${row.nombre}` : '',
        dni: row.dni || '',
        codigo_externo: row.codigo_externo || '',
        fecha_entrada: row.fecha_entrada || ''
      })
    }

    // ── Hoja 2: Historial ───────────────────────────────────────────────────
    const hojaHistorial = workbook.addWorksheet('Historial')
    hojaHistorial.columns = [
      { header: 'Habitación', key: 'habitacion', width: 12 },
      { header: 'Residente', key: 'residente', width: 28 },
      { header: 'DNI', key: 'dni', width: 12 },
      { header: 'Cód. Residente', key: 'codigo_externo', width: 14 },
      { header: 'Fecha entrada', key: 'fecha_entrada', width: 14 },
      { header: 'Fecha salida', key: 'fecha_salida', width: 14 },
      { header: 'Motivo salida', key: 'motivo_alta', width: 22 },
      { header: 'Notas', key: 'notas', width: 30 }
    ]
    estiloCabecera(hojaHistorial)
    for (const row of historial) {
      hojaHistorial.addRow({
        habitacion: row.habitacion,
        residente: `${row.apellidos}, ${row.nombre}`,
        dni: row.dni || '',
        codigo_externo: row.codigo_externo || '',
        fecha_entrada: row.fecha_entrada,
        fecha_salida: row.fecha_salida || '',
        motivo_alta: row.motivo_alta || '',
        notas: row.notas || ''
      })
    }

    // ── Hoja 3: Habitaciones libres ─────────────────────────────────────────
    const hojaLibres = workbook.addWorksheet('Habitaciones libres')
    hojaLibres.columns = [
      { header: 'Habitación', key: 'numero', width: 12 },
      { header: 'Planta', key: 'planta', width: 14 },
      { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Capacidad', key: 'capacidad', width: 10 },
      { header: 'Plazas libres', key: 'plazas_libres', width: 14 }
    ]
    estiloCabecera(hojaLibres)
    for (const row of libres) {
      hojaLibres.addRow({
        numero: row.numero,
        planta: capitalizarPlanta(row.planta),
        tipo: row.tipo,
        capacidad: row.capacidad,
        plazas_libres: row.plazas_libres
      })
    }

    await workbook.xlsx.writeFile(rutaDestino)
    return { ok: true }
  })
}

function estiloCabecera(hoja) {
  const headerRow = hoja.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  }
}

function capitalizarPlanta(p) {
  const map = { baja: 'Planta Baja', primera: 'Primera Planta', segunda: 'Segunda Planta' }
  return map[p] || p
}

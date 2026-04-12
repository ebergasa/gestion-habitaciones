import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Versión
  getVersion: () => ipcRenderer.invoke('getVersion'),

  // Configuración
  getConfig: () => ipcRenderer.invoke('getConfig'),
  setNombreResidencia: (nombre) => ipcRenderer.invoke('setNombreResidencia', nombre),
  seleccionarLogo: () => ipcRenderer.invoke('seleccionarLogo'),
  deleteLogo: () => ipcRenderer.invoke('deleteLogo'),
  setMotivoCambioHabitacion: (id) => ipcRenderer.invoke('setMotivoCambioHabitacion', id),

  // Habitaciones
  getHabitacionesConOcupacion: () => ipcRenderer.invoke('getHabitacionesConOcupacion'),
  updateHabitacion: (id, data) => ipcRenderer.invoke('updateHabitacion', id, data),

  // Residentes
  getResidentes: () => ipcRenderer.invoke('getResidentes'),
  createResidente: (data) => ipcRenderer.invoke('createResidente', data),
  updateResidente: (id, data) => ipcRenderer.invoke('updateResidente', id, data),
  deleteResidente: (id) => ipcRenderer.invoke('deleteResidente', id),

  // Ocupaciones
  asignarResidente: (habitacionId, residenteId, fechaEntrada) =>
    ipcRenderer.invoke('asignarResidente', habitacionId, residenteId, fechaEntrada),
  desasignarResidente: (ocupacionId, data) =>
    ipcRenderer.invoke('desasignarResidente', ocupacionId, data),
  cambiarHabitacion: (ocupacionId, data) =>
    ipcRenderer.invoke('cambiarHabitacion', ocupacionId, data),

  // Motivos de alta
  getMotivosAlta: () => ipcRenderer.invoke('getMotivosAlta'),
  createMotivoAlta: (data) => ipcRenderer.invoke('createMotivoAlta', data),
  updateMotivoAlta: (id, data) => ipcRenderer.invoke('updateMotivoAlta', id, data),
  deleteMotivoAlta: (id) => ipcRenderer.invoke('deleteMotivoAlta', id),

  // Historial
  getHistorial: (filtros) => ipcRenderer.invoke('getHistorial', filtros),

  // Búsqueda
  buscarPorHabitacion: (numero) => ipcRenderer.invoke('buscarPorHabitacion', numero),
  buscarPorResidente: (texto) => ipcRenderer.invoke('buscarPorResidente', texto),
  getHabitacionesLibres: () => ipcRenderer.invoke('getHabitacionesLibres'),

  // Insights
  getInsights: (params) => ipcRenderer.invoke('getInsights', params),
  getDbPath:   () => ipcRenderer.invoke('getDbPath'),
  getBackups:  () => ipcRenderer.invoke('getBackups'),

  // Base de datos
  getRutaDB: () => ipcRenderer.invoke('getRutaDB'),
  setRutaDB: (ruta) => ipcRenderer.invoke('setRutaDB', ruta),
  seleccionarCarpetaDB: () => ipcRenderer.invoke('seleccionarCarpetaDB'),
  reiniciarApp: () => ipcRenderer.invoke('reiniciarApp'),

  // Exportación
  seleccionarRutaExcel: (defaultName) => ipcRenderer.invoke('seleccionarRutaExcel', defaultName),
  exportarExcel: (ruta) => ipcRenderer.invoke('exportarExcel', ruta),
  exportarResidentes: (filas, rutaDestino) => ipcRenderer.invoke('exportarResidentes', { filas, rutaDestino })
}

contextBridge.exposeInMainWorld('api', api)

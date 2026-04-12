import { app, BrowserWindow, shell, dialog } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initDB, acquireLock, releaseLock } from './db.js'
import { registerHandlers } from './ipc.js'
import { crearBackup } from './backup.js'
import { initConfig, getRutaDB } from './config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function createWindow() {
  const iconPath = app.isPackaged
    ? join(process.resourcesPath, '../build/icon.ico')
    : join(__dirname, '../../build/icon.ico')

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    title: 'Gestión de Habitaciones',
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  // initConfig debe ir primero para poder leer la ruta de la BD
  initConfig(app.getPath('userData'))

  // Ruta de la BD: variable de entorno > configuración guardada > junto al exe
  const defaultDbPath = join(dirname(app.getPath('exe')), 'gestion-habitaciones.sqlite')
  const dbPath = process.env.DB_PATH || getRutaDB() || defaultDbPath

  // Comprobar que no hay otra instancia usando la BD en red
  const lock = acquireLock(dbPath)
  if (lock.locked) {
    dialog.showMessageBoxSync({
      type:    'warning',
      title:   'Base de datos en uso',
      message: `La base de datos ya está abierta en el equipo "${lock.hostname}".\n\nCierra esa instancia antes de continuar.`
    })
    app.exit(0)
    return
  }

  crearBackup(dbPath)
  initDB(dbPath)
  registerHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  releaseLock()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

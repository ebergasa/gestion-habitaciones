import { app, BrowserWindow, shell } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initDB } from './db.js'
import { registerHandlers } from './ipc.js'
import { crearBackup } from './backup.js'
import { initConfig } from './config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Ruta de la base de datos: variable de entorno o carpeta de datos del usuario
const dbPath = process.env.DB_PATH || join(app.getPath('userData'), 'gestion-habitaciones.sqlite')

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    title: 'Gestión de Habitaciones',
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
    win.loadFile(join(__dirname, '../renderer/index.html'))  // electron-vite build output
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  initConfig(app.getPath('userData'))
  crearBackup(dbPath)
  initDB(dbPath)
  registerHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

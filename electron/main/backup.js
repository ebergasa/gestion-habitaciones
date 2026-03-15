import fs from 'fs'
import path from 'path'

export function crearBackup(dbPath) {
  if (!fs.existsSync(dbPath)) return

  const dir = path.dirname(dbPath)
  const backupsDir = path.join(dir, 'backups')

  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true })
  }

  const now = new Date()
  const ts = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
  const destino = path.join(backupsDir, `db-${ts}.sqlite`)

  fs.copyFileSync(dbPath, destino)

  // Mantener solo los 5 backups más recientes
  const archivos = fs
    .readdirSync(backupsDir)
    .filter(f => f.startsWith('db-') && f.endsWith('.sqlite'))
    .sort()

  if (archivos.length > 5) {
    const aEliminar = archivos.slice(0, archivos.length - 5)
    for (const f of aEliminar) {
      fs.unlinkSync(path.join(backupsDir, f))
    }
  }
}

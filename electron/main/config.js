import fs from 'fs'
import path from 'path'

let configPath

export function initConfig(userDataPath) {
  configPath = path.join(userDataPath, 'config.json')
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({}), 'utf8')
  }
}

function read() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } catch {
    return {}
  }
}

function write(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8')
}


export function getRutaDB() {
  return read().rutaDB || null
}

export function setRutaDB(ruta) {
  const cfg = read()
  if (ruta) cfg.rutaDB = ruta
  else delete cfg.rutaDB
  write(cfg)
}

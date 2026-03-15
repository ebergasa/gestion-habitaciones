import fs from 'fs'
import path from 'path'

let configPath

export function initConfig(userDataPath) {
  configPath = path.join(userDataPath, 'config.json')
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ nombreResidencia: 'Residencia' }), 'utf8')
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

export function getConfig() {
  const cfg = read()
  return {
    nombreResidencia: cfg.nombreResidencia || 'Residencia',
    logo: cfg.logo || null
  }
}

export function setNombreResidencia(nombre) {
  const cfg = read()
  cfg.nombreResidencia = nombre
  write(cfg)
}

export function setLogo(dataUrl) {
  const cfg = read()
  cfg.logo = dataUrl
  write(cfg)
}

export function deleteLogo() {
  const cfg = read()
  delete cfg.logo
  write(cfg)
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

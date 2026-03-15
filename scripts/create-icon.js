// Genera build/icon.ico con las iniciales "GH" sobre fondo azul
// Uso: node scripts/create-icon.js

const Jimp           = require('jimp')
const { imagesToIco } = require('png-to-ico')
const fs             = require('fs')
const path           = require('path')

const BUILD_DIR = path.join(__dirname, '..', 'build')
const BG_COLOR  = 0x2563ebff  // azul primario
const TEXTO     = 'GH'

async function crearImagen(size) {
  const img = new Jimp(size, size, BG_COLOR)

  let fontKey = null
  if      (size >= 128) fontKey = Jimp.FONT_SANS_128_WHITE
  else if (size >= 48)  fontKey = Jimp.FONT_SANS_32_WHITE
  else if (size >= 24)  fontKey = Jimp.FONT_SANS_16_WHITE

  if (fontKey) {
    const font = await Jimp.loadFont(fontKey)
    const tw   = Jimp.measureText(font, TEXTO)
    const th   = Jimp.measureTextHeight(font, TEXTO, size)
    img.print(font, Math.floor((size - tw) / 2), Math.floor((size - th) / 2), TEXTO)
  }

  return {
    data:   img.bitmap.data,
    width:  img.bitmap.width,
    height: img.bitmap.height
  }
}

async function main() {
  if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true })

  console.log('Generando tamaños: 16, 32, 48, 256...')
  const bitmaps = await Promise.all([16, 32, 48, 256].map(crearImagen))

  const ico = imagesToIco(bitmaps)
  const out = path.join(BUILD_DIR, 'icon.ico')
  fs.writeFileSync(out, ico)
  console.log(`Icono generado: ${out}`)
}

main().catch(err => { console.error(err); process.exit(1) })

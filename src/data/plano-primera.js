// Primera Planta: habitaciones 101-175 (75 habitaciones)
// Layout perimetral con 4 zonas:
//   Ala izquierda  (101-118): col izquierda 12 hab, col derecha 6 hab (doble alto)
//   Corredor sur   (119-136): fila superior 6 hab (doble ancho), fila inferior 12 hab
//   Ala derecha    (137-157): col interior 6 hab (doble alto), col exterior 15 hab
//   Corredor norte (158-175): fila superior 12 hab, fila inferior 6 hab (doble ancho)
//
// viewBox 1500×780 → ratio 1.92, encaja en A4 landscape 10mm márgenes sin cortes

export const viewBox = '0 0 1500 780'

const RW = 90   // ancho habitación (alas)
const RH = 52   // alto habitación (corredores)
const G  = 3    // gap entre habitaciones

// Corredor: 12 columnas, span = 1500 - 10 - 2*(RW+G+RW) - 10 - 10 - 10 = 1089px
// xCorStart = 10 + RW + G + RW + 10 = 203
const xCorStart = 50
const RW_COR  = 88              // ancho hab corredor (12 cols: 12*88+11*3 = 1089px)
const RW_COR2 = RW_COR * 2 + G // ancho hab doble (= 179px)

// ── Ala izquierda (101-118) ──────────────────────────────────────────────────
// col izq (12 hab): 101,102, 104,105, 107,108, 110,111, 113,114, 116,117
// col der ( 6 hab): 103, 106, 109, 112, 115, 118  (doble alto)
const RH_IZQ  = 38
const RH_IZQ2 = RH_IZQ * 2 + G
const col1Nums = [101, 102, 104, 105, 107, 108, 110, 111, 113, 114, 116, 117]
const col2Nums = [103, 106, 109, 112, 115, 118]
const alaIzq = []
for (let i = 0; i < 12; i++) {
  alaIzq.push({ numero: String(col1Nums[i]), x: 10,          y: 140 + i * (RH_IZQ + G),  w: RW, h: RH_IZQ })
}
for (let i = 0; i < 6; i++) {
  alaIzq.push({ numero: String(col2Nums[i]), x: 10 + RW + G, y: 140 + i * (RH_IZQ2 + G), w: RW, h: RH_IZQ2 })
}

// ── Corredor sur (119-136) ───────────────────────────────────────────────────
// Fila superior (izq→der): 121, 124, 127, 130, 133, 136  (doble ancho)
// Fila inferior (izq→der): 119,120, 122,123, 125,126, 128,129, 131,132, 134,135
const corSurSup = [121, 124, 127, 130, 133, 136]
const corSurInf = [119, 120, 122, 123, 125, 126, 128, 129, 131, 132, 134, 135]
const corridorBottom = []
for (let i = 0; i < 6; i++) {
  corridorBottom.push({ numero: String(corSurSup[i]), x: xCorStart + i * (RW_COR2 + G), y: 640,          w: RW_COR2, h: RH })
}
for (let i = 0; i < 12; i++) {
  corridorBottom.push({ numero: String(corSurInf[i]), x: xCorStart + i * (RW_COR + G),  y: 640 + RH + G, w: RW_COR,  h: RH })
}

// ── Ala derecha (137-157) ────────────────────────────────────────────────────
// col exterior (15 hab, top→bottom): 157, 155,154, 152,151, 149,148, 146,145, 143,142, 140,139, 138,137
// col interior ( 6 hab, doble alto): 156, 153, 150, 147, 144, 141
//   157 sola arriba; 138,137 solas abajo
const RH_DER  = 38
const RH_DER2 = RH_DER * 2 + G
const xDer1 = 1500 - 10 - 2 * RW - G   // columna interior
const xDer2 = 1500 - 10 - RW            // columna exterior
const col2ExtNums = [157, 155, 154, 152, 151, 149, 148, 146, 145, 143, 142, 140, 139, 138, 137]
const col1IntNums = [156, 153, 150, 147, 144, 141]
const alaDer = []
for (let i = 0; i < 15; i++) {
  alaDer.push({ numero: String(col2ExtNums[i]), x: xDer2, y: 140 + i * (RH_DER + G), w: RW, h: RH_DER })
}
for (let i = 0; i < 6; i++) {
  alaDer.push({ numero: String(col1IntNums[i]), x: xDer1, y: 140 + (RH_DER + G) + i * (RH_DER2 + G), w: RW, h: RH_DER2 })
}

// ── Corredor norte (158-175) ─────────────────────────────────────────────────
// Fila superior (izq→der): 174,173, 171,170, 168,167, 165,164, 162,161, 159,158
// Fila inferior (izq→der): 175, 172, 169, 166, 163, 160  (doble ancho)
const corNorSup = [174, 173, 171, 170, 168, 167, 165, 164, 162, 161, 159, 158]
const corNorInf = [175, 172, 169, 166, 163, 160]
const corridorTop = []
for (let i = 0; i < 12; i++) {
  corridorTop.push({ numero: String(corNorSup[i]), x: xCorStart + i * (RW_COR + G), y: 15,          w: RW_COR,  h: RH })
}
for (let i = 0; i < 6; i++) {
  corridorTop.push({ numero: String(corNorInf[i]), x: xCorStart + i * (RW_COR2 + G), y: 15 + RH + G, w: RW_COR2, h: RH })
}

export const rooms = [...alaIzq, ...corridorBottom, ...alaDer, ...corridorTop]

export const zones = []

export const labels = [
  { text: 'PRIMERA PLANTA', x: 750, y: 390, fontSize: 28, fontWeight: 'bold', color: '#e0e0e0' },
  { text: 'Ala Izquierda',  x: 102, y: 128, fontSize: 10, color: '#aaa' },
  { text: 'Ala Derecha',    x: 1394, y: 128, fontSize: 10, color: '#aaa' },
  { text: 'Corredor Norte', x: 748,  y: 7,   fontSize: 10, color: '#aaa' },
  { text: 'Corredor Sur',   x: 748,  y: 633, fontSize: 10, color: '#aaa' },
]

export const walls = []

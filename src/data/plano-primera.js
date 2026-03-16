// Primera Planta: habitaciones 101-175 (75 habitaciones)
// Layout perimetral con 4 zonas:
//   Ala izquierda  (101-118): col izquierda 12 hab, col derecha 6 hab (doble alto)
//   Corredor inferior (119-136): 2 filas × 9 columnas, parte inferior
//   Ala derecha    (137-157): col interior 6 hab, col exterior 15 hab
//   Corredor superior (158-175): 2 filas × 9 columnas, parte superior

export const viewBox = '0 0 1100 780'

const RW = 65   // ancho habitación
const RH = 52   // alto habitación (columnas estándar)
const G  = 3    // gap entre habitaciones

// — Ala izquierda (101-118): col izquierda 12 hab, col derecha 6 hab doble alto —
// Numeración: 101,102,103 | 104,105,106 | ... | 116,117,118
//   col izq (12): 101,102, 104,105, 107,108, 110,111, 113,114, 116,117
//   col der ( 6): 103, 106, 109, 112, 115, 118  (cada una ocupa 2 filas de col izq)
const RH_IZQ  = 38              // alto hab col izquierda (12 filas caben en el ala)
const RH_IZQ2 = RH_IZQ * 2 + G // alto hab col derecha (doble)
const col1Nums = [101, 102, 104, 105, 107, 108, 110, 111, 113, 114, 116, 117]
const col2Nums = [103, 106, 109, 112, 115, 118]
const alaIzq = []
for (let i = 0; i < 12; i++) {
  alaIzq.push({ numero: String(col1Nums[i]), x: 10,          y: 140 + i * (RH_IZQ + G),  w: RW, h: RH_IZQ })
}
for (let i = 0; i < 6; i++) {
  alaIzq.push({ numero: String(col2Nums[i]), x: 10 + RW + G, y: 140 + i * (RH_IZQ2 + G), w: RW, h: RH_IZQ2 })
}

// — Corredor sur (119-136): fila superior 6 hab (doble ancho), fila inferior 12 hab —
// Fila superior (izq→der): 121, 124, 127, 130, 133, 136  (cada una ocupa 2 columnas)
// Fila inferior (izq→der): 119, 120, 122, 123, 125, 126, 128, 129, 131, 132, 134, 135
const RW_SUR  = 48              // ancho hab fila inferior (12 columnas, igual que corredor norte)
const RW_SUR2 = RW_SUR * 2 + G // ancho hab fila superior (doble = 99)
const corSurSup = [121, 124, 127, 130, 133, 136]
const corSurInf = [119, 120, 122, 123, 125, 126, 128, 129, 131, 132, 134, 135]
const corridorBottom = []
for (let i = 0; i < 6; i++) {
  corridorBottom.push({ numero: String(corSurSup[i]), x: 155 + i * (RW_SUR2 + G), y: 640,          w: RW_SUR2, h: RH })
}
for (let i = 0; i < 12; i++) {
  corridorBottom.push({ numero: String(corSurInf[i]), x: 155 + i * (RW_SUR + G),  y: 640 + RH + G, w: RW_SUR,  h: RH })
}

// — Ala derecha (137-157): col exterior 15 hab, col interior 6 hab (doble alto) —
// Col exterior (top→bottom): 157, 155,154, 152,151, 149,148, 146,145, 143,142, 140,139, 138,137
// Col interior (top→bottom): 156, 153, 150, 147, 144, 141  (alineadas con pares de col exterior)
//   157 va sola arriba; 138,137 van solas abajo
const RH_DER  = 38              // alto hab col exterior (15 filas)
const RH_DER2 = RH_DER * 2 + G // alto hab col interior (doble = 79)
const xDer1 = 1100 - 10 - 2 * RW - G   // columna interior
const xDer2 = 1100 - 10 - RW            // columna exterior
const col2ExtNums = [157, 155, 154, 152, 151, 149, 148, 146, 145, 143, 142, 140, 139, 138, 137]
const col1IntNums = [156, 153, 150, 147, 144, 141]
const alaDer = []
for (let i = 0; i < 15; i++) {
  alaDer.push({ numero: String(col2ExtNums[i]), x: xDer2, y: 140 + i * (RH_DER + G), w: RW, h: RH_DER })
}
for (let i = 0; i < 6; i++) {
  // empieza después de la primera hab de col exterior (157), luego cada 2 filas
  alaDer.push({ numero: String(col1IntNums[i]), x: xDer1, y: 140 + (RH_DER + G) + i * (RH_DER2 + G), w: RW, h: RH_DER2 })
}

// — Corredor norte (158-175): fila superior 12 hab, fila inferior 6 hab (doble ancho) —
// Fila superior (izq→der): 174,173, 171,170, 168,167, 165,164, 162,161, 159,158
// Fila inferior (izq→der): 175, 172, 169, 166, 163, 160  (cada una ocupa 2 columnas)
const RW_NOR  = 48              // ancho hab fila superior (12 columnas en el corredor)
const RW_NOR2 = RW_NOR * 2 + G // ancho hab fila inferior (doble = 99)
const corNorSup = [174, 173, 171, 170, 168, 167, 165, 164, 162, 161, 159, 158]
const corNorInf = [175, 172, 169, 166, 163, 160]
const corridorTop = []
for (let i = 0; i < 12; i++) {
  corridorTop.push({ numero: String(corNorSup[i]), x: 155 + i * (RW_NOR + G), y: 15,          w: RW_NOR,  h: RH })
}
for (let i = 0; i < 6; i++) {
  corridorTop.push({ numero: String(corNorInf[i]), x: 155 + i * (RW_NOR2 + G), y: 15 + RH + G, w: RW_NOR2, h: RH })
}

export const rooms = [...alaIzq, ...corridorBottom, ...alaDer, ...corridorTop]

export const zones = []

export const labels = [
  { text: 'PRIMERA PLANTA', x: 550, y: 390, fontSize: 26, fontWeight: 'bold', color: '#e0e0e0' },
  { text: 'Ala Izquierda',   x: 78,  y: 128, fontSize: 10, color: '#aaa' },
  { text: 'Ala Derecha',     x: 990, y: 128, fontSize: 10, color: '#aaa' },
  { text: 'Corredor Norte',  x: 459, y: 7,   fontSize: 10, color: '#aaa' },
  { text: 'Corredor Sur',    x: 459, y: 633, fontSize: 10, color: '#aaa' },
]

export const walls = []

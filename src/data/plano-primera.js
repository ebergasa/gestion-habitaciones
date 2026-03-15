// Primera Planta: habitaciones 101-175 (75 habitaciones)
// Layout perimetral con 4 zonas:
//   Ala izquierda  (101-118): 2 columnas × 9 filas, lado izquierdo
//   Corredor inferior (119-136): 2 filas × 9 columnas, parte inferior
//   Ala derecha    (137-157): 2 columnas (11+10 filas), lado derecho
//   Corredor superior (158-175): 2 filas × 9 columnas, parte superior

export const viewBox = '0 0 1100 780'

const RW = 65   // ancho habitación
const RH = 52   // alto habitación
const G  = 3    // gap entre habitaciones

// — Ala izquierda (101-118): columna izquierda 101-109, columna derecha 110-118 —
const alaIzq = []
for (let i = 0; i < 9; i++) {
  alaIzq.push({ numero: String(101 + i), x: 10,        y: 140 + i * (RH + G), w: RW, h: RH })
  alaIzq.push({ numero: String(110 + i), x: 10 + RW + G, y: 140 + i * (RH + G), w: RW, h: RH })
}

// — Corredor inferior (119-136): fila superior 119-127, fila inferior 128-136 —
const corridorBottom = []
for (let i = 0; i < 9; i++) {
  corridorBottom.push({ numero: String(119 + i), x: 155 + i * (RW + G), y: 640,          w: RW, h: RH })
  corridorBottom.push({ numero: String(128 + i), x: 155 + i * (RW + G), y: 640 + RH + G, w: RW, h: RH })
}

// — Ala derecha (137-157): columna interior 137-147 (11), columna exterior 148-157 (10) —
const xDer1 = 1100 - 10 - 2 * RW - G   // columna interior = 957
const xDer2 = 1100 - 10 - RW            // columna exterior = 1025
const alaDer = []
for (let i = 0; i < 11; i++) {
  alaDer.push({ numero: String(137 + i), x: xDer1, y: 140 + i * (RH + G), w: RW, h: RH })
}
for (let i = 0; i < 10; i++) {
  alaDer.push({ numero: String(148 + i), x: xDer2, y: 140 + i * (RH + G), w: RW, h: RH })
}

// — Corredor superior (158-175): fila superior 158-166, fila inferior 167-175 —
const corridorTop = []
for (let i = 0; i < 9; i++) {
  corridorTop.push({ numero: String(158 + i), x: 155 + i * (RW + G), y: 15,          w: RW, h: RH })
  corridorTop.push({ numero: String(167 + i), x: 155 + i * (RW + G), y: 15 + RH + G, w: RW, h: RH })
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

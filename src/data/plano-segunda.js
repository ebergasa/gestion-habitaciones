// Segunda Planta: habitaciones 201-239 (39 habitaciones)
// Layout perimetral con 4 zonas:
//   Ala izquierda  (201-212): 2 columnas × 6 filas, lado izquierdo
//   Corredor inferior (213-224): 2 filas × 6 columnas, parte inferior
//   Ala derecha    (228-239): 2 columnas × 6 filas, lado derecho
//   Corredor superior Asistidos (225-227): 3 habitaciones en zona especializada

export const viewBox = '0 0 1100 600'

const RW = 65   // ancho habitación
const RH = 52   // alto habitación
const G  = 3    // gap entre habitaciones

// — Ala izquierda (201-212): columna izquierda 201-206, columna derecha 207-212 —
const alaIzq = []
for (let i = 0; i < 6; i++) {
  alaIzq.push({ numero: String(201 + i), x: 10,        y: 140 + i * (RH + G), w: RW, h: RH })
  alaIzq.push({ numero: String(207 + i), x: 10 + RW + G, y: 140 + i * (RH + G), w: RW, h: RH })
}

// — Corredor inferior (213-224): fila superior 213-218, fila inferior 219-224 —
const corridorBottom = []
for (let i = 0; i < 6; i++) {
  corridorBottom.push({ numero: String(213 + i), x: 155 + i * (RW + G), y: 490,          w: RW, h: RH })
  corridorBottom.push({ numero: String(219 + i), x: 155 + i * (RW + G), y: 490 + RH + G, w: RW, h: RH })
}

// — Ala derecha (228-239): columna interior 228-233, columna exterior 234-239 —
const xDer1 = 1100 - 10 - 2 * RW - G   // = 957
const xDer2 = 1100 - 10 - RW            // = 1025
const alaDer = []
for (let i = 0; i < 6; i++) {
  alaDer.push({ numero: String(228 + i), x: xDer1, y: 140 + i * (RH + G), w: RW, h: RH })
  alaDer.push({ numero: String(234 + i), x: xDer2, y: 140 + i * (RH + G), w: RW, h: RH })
}

// — Corredor superior: Asistidos (225-227) —
// 225 y 226 en zona Asistidos I, 227 en zona Asistidos II
const corridorTop = [
  { numero: '225', x: 165,             y: 18, w: RW, h: RH },
  { numero: '226', x: 165 + RW + G,    y: 18, w: RW, h: RH },
  { numero: '227', x: 730,             y: 18, w: RW, h: RH },
]

export const rooms = [...alaIzq, ...corridorBottom, ...alaDer, ...corridorTop]

// Zonas comunes decorativas
export const zones = [
  { text: 'Asistidos I',  x: 155, y: 8,   w: 152, h: 74 },
  { text: 'Descanso',     x: 312, y: 8,   w: 413, h: 74 },
  { text: 'Asistidos II', x: 730, y: 8,   w: 215, h: 74 },
  { text: 'UCI',          x: 160, y: 280, w: 130, h: 65 },
]

export const labels = [
  { text: 'SEGUNDA PLANTA', x: 550, y: 310, fontSize: 26, fontWeight: 'bold', color: '#e0e0e0' },
  { text: 'Ala Izquierda',  x: 78,  y: 128, fontSize: 10, color: '#aaa' },
  { text: 'Ala Derecha',    x: 990, y: 128, fontSize: 10, color: '#aaa' },
  { text: 'Corredor Sur',   x: 385, y: 483, fontSize: 10, color: '#aaa' },
]

export const walls = []

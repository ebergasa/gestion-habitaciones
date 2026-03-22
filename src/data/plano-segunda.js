// Segunda Planta: habitaciones 201-239 (39 habitaciones)
// Layout perimetral con 4 zonas:
//   Ala sur        (201-212): 2 columnas × 6 filas, lado izquierdo
//   Corredor inferior (213-224): 2 filas × 6 columnas, parte inferior
//   Ala norte      (228-239): 2 columnas × 6 filas, lado derecho
//   Corredor superior Asistidos (225-227): 3 habitaciones en zona especializada

export const viewBox = '0 0 1100 600'

const RW = 100   // ancho habitación
const RH = 52   // alto habitación
const G  = 3    // gap entre habitaciones

// — Ala sur (201-212): columna izquierda 201-206, columna derecha 207-212 —
const ALA_IZQ_Y = 120
const alaIzq = []
for (let i = 0; i < 6; i++) {
  alaIzq.push({ numero: String(201 + i), x: 10,          y: ALA_IZQ_Y + i * (RH + G), w: RW, h: RH })
  alaIzq.push({ numero: String(207 + i), x: 10 + RW + G, y: ALA_IZQ_Y + i * (RH + G), w: RW, h: RH })
}

// — Corredor inferior (213-224): fila superior 213-218, fila inferior 219-224 —
const COR_SUR_X = 155         // x donde empieza el corredor sur
const COR_SUR_W = 129         // ancho de habitación (6 cols: 6×129+5×3 = 789px, llega hasta el ala derecha)
const corridorBottom = []
for (let i = 0; i < 6; i++) {
  corridorBottom.push({ numero: String(213 + i), x: COR_SUR_X + i * (COR_SUR_W + G), y: 490,          w: COR_SUR_W, h: RH })
  corridorBottom.push({ numero: String(219 + i), x: COR_SUR_X + i * (COR_SUR_W + G), y: 490 + RH + G, w: COR_SUR_W, h: RH })
}

// — Ala norte (225-239) —
// Columna exterior (9 hab, de arriba a abajo): 239, 237, 235, 233, 231, 229, 227, 226, 225
// Columna interior (6 hab, empieza una fila más abajo): 238, 236, 234, 232, 230, 228
const xDer1 = 1100 - 10 - 2 * RW - G   // columna interior (= 957)
const xDer2 = 1100 - 10 - RW            // columna exterior (= 1025)
const ALA_DER_Y = 70                   // y donde empieza el ala derecha
const alaDerExt = [239, 237, 235, 233, 231, 229, 227, 226, 225]
const alaDerInt = [238, 236, 234, 232, 230, 228]
const alaDer = []
for (let i = 0; i < alaDerExt.length; i++) {
  alaDer.push({ numero: String(alaDerExt[i]), x: xDer2, y: ALA_DER_Y + i * (RH + G), w: RW, h: RH })
}
for (let i = 0; i < alaDerInt.length; i++) {
  alaDer.push({ numero: String(alaDerInt[i]), x: xDer1, y: ALA_DER_Y + (RH + G) + i * (RH + G), w: RW, h: RH })
}

const corridorTop = []

export const rooms = [...alaIzq, ...corridorBottom, ...alaDer, ...corridorTop]

// Zonas comunes decorativas
export const zones = [
  { text: 'Asistidos I',  x: 155, y: 8,   w: 152, h: 74 },
  { text: 'Descanso',     x: 312, y: 8,   w: 413, h: 74 },
  { text: 'Asistidos II', x: 730, y: 8,   w: 215, h: 74 },
  { text: 'UCI',          x: 10,  y: 483, w: 100, h: 65 },
]

export const labels = [
  { text: 'SEGUNDA PLANTA', x: 550, y: 310, fontSize: 26, fontWeight: 'bold', color: '#e0e0e0' },
  { text: 'Ala Sur',        x: 78,  y: 110, fontSize: 10, color: '#aaa' },
  { text: 'Ala Norte',      x: 900, y: 110, fontSize: 10, color: '#aaa' },
  { text: 'Corredor Este',  x: 550, y: 483, fontSize: 10, color: '#aaa' },
]

export const walls = []

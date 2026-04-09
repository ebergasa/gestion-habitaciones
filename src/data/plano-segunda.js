// Segunda Planta: habitaciones 201-239 (39 habitaciones)
// Layout perimetral con 4 zonas:
//   Ala sur        (201-212): 2 columnas × 6 filas, lado sur
//   Corredor este  (213-224): 2 filas × 6 columnas, parte inferior
//   Ala norte      (228-239): 2 columnas × 6 filas, lado norte
//   Corredor oeste (225-227): 3 habitaciones en zona especializada

export const viewBox = '0 0 1100 600'

const RW = 100   // ancho habitación
const RH = 52   // alto habitación
const G  = 3    // gap entre habitaciones

// — Ala sur (201-212): columna izquierda 201-206, columna derecha 207-212 —
const ALA_SUR_Y       = 110
const ALA_SUR_COL_GAP = 50   // separación entre columna izquierda e interior del ala sur
                              // columna derecha = 10 + RW + ALA_SUR_COL_GAP
const alaSur = []
for (let i = 0; i < 6; i++) {
  alaSur.push({ numero: String(201 + i), x: 10,                        y: ALA_SUR_Y + i * (RH + G), w: RW, h: RH })
  alaSur.push({ numero: String(207 + i), x: 10 + RW + ALA_SUR_COL_GAP, y: ALA_SUR_Y + i * (RH + G), w: RW, h: RH })
}

// — Corredor este (213-224): fila superior 213-218, fila inferior 219-224 —
const COR_ESTE_X       = 155   // x donde empieza el corredor este
const COR_ESTE_Y       = 460   // y donde empieza el corredor este
const COR_ESTE_W       = 129   // ancho de habitación (6 cols: 6×129+5×3 = 789px, llega hasta el ala norte)
const COR_ESTE_ROW_GAP = 30    // separación entre fila superior e inferior del corredor este
const corEste = []
for (let i = 0; i < 6; i++) {
  corEste.push({ numero: String(213 + i), x: COR_ESTE_X + i * (COR_ESTE_W + G), y: COR_ESTE_Y,                       w: COR_ESTE_W, h: RH })
  corEste.push({ numero: String(219 + i), x: COR_ESTE_X + i * (COR_ESTE_W + G), y: COR_ESTE_Y + RH + COR_ESTE_ROW_GAP, w: COR_ESTE_W, h: RH })
}

// — Ala norte (225-239) —
// Columna exterior (9 hab, de arriba a abajo): 239, 237, 235, 233, 231, 229, 227, 226, 225
// Columna interior (6 hab, empieza una fila más abajo): 238, 236, 234, 232, 230, 228
const ALA_NORTE_COL_GAP = 50              // separación entre columna interior y exterior del ala norte
const ALA_NORTE_X_EXT = 1100 - 10 - RW   // columna exterior (= 990)
const ALA_NORTE_X_INT = ALA_NORTE_X_EXT - RW - ALA_NORTE_COL_GAP // columna interior (= 840)
const ALA_NORTE_Y = 60                    // y donde empieza el ala norte
const alaNorteExt = [239, 237, 235, 233, 231, 229, 227, 226, 225]
const alaNorteInt = [238, 236, 234, 232, 230, 228]
const alaNorte = []
for (let i = 0; i < alaNorteExt.length; i++) {
  alaNorte.push({ numero: String(alaNorteExt[i]), x: ALA_NORTE_X_EXT, y: ALA_NORTE_Y + i * (RH + G), w: RW, h: RH })
}
for (let i = 0; i < alaNorteInt.length; i++) {
  alaNorte.push({ numero: String(alaNorteInt[i]), x: ALA_NORTE_X_INT, y: ALA_NORTE_Y + (RH + G) + i * (RH + G), w: RW, h: RH })
}

const corOeste = []

export const rooms = [...alaSur, ...corEste, ...alaNorte, ...corOeste]

// Zonas comunes decorativas
export const zones = [
  { text: 'Asistidos I',  x: 155, y: 8,   w: 152, h: 74 },
  { text: 'Descanso',     x: 312, y: 8,   w: 413, h: 74 },
  { text: 'Asistidos II', x: 730, y: 8,   w: 215, h: 74 },
  { text: 'UCI',          x: 10,  y: 483, w: 100, h: 65 },
]

export const labels = [
  { text: 'SEGUNDA PLANTA', x: 550, y: 310, fontSize: 26, fontWeight: 'bold', color: '#e0e0e0' },
  { text: 'Ala Sur',        x: 78,  y: 100, fontSize: 10, color: '#aaa' },
  { text: 'Ala Norte',      x: 900, y: 100, fontSize: 10, color: '#aaa' },
  { text: 'Corredor Este',  x: 550, y: 430, fontSize: 10, color: '#aaa' },
]

export const walls = []

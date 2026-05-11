// Primera Planta: habitaciones 101-176 (76 habitaciones)
// viewBox 1500×860 → ratio 1.74, encaja en A4 landscape 10mm márgenes sin cortes
//
// Distribución:
//   Ala sur      (101-118) — columna exterior simple + columna interior doble alto
//   Corredor este (119-136) — dos filas horizontales, parte inferior
//   Ala norte    (137-157) — columna interior doble alto + columna exterior simple
//   Corredor oeste (158-176) — dos filas horizontales, parte superior (13 simples + 6 dobles)

export const viewBox = '0 0 1500 860'

// ── Tamaños ───────────────────────────────────────────────────────────────────

const GAP    = 3    // separación entre habitaciones

const ALA_NORTE_W  = 210  // ancho de habitación en el ala norte
const ALA_SUR_W    = 200  // ancho de habitación en el ala sur
const ALA_SUR_H    = 45   // alto de habitación simple en el ala sur
const ALA_SUR_H2   = ALA_SUR_H * 2 + GAP   // alto de habitación doble ala sur
const ALA_NORTE_EXT_H  = 54   // alto de habitación simple en el ala norte (col exterior: 157,155,…)
const ALA_NORTE_INT_H  = 45   // alto de habitación simple en el ala norte (col interior: 156,153,…)
const ALA_NORTE_INT_H2 = ALA_NORTE_INT_H * 2 + GAP // alto de habitación doble ala norte (col interior)

const COR_W  = 103   // ancho de habitación simple en el corredor este (12 simples)
const COR_H  = 67   // alto de habitación en los corredores
const COR_W2 = COR_W * 2 + GAP   // ancho de habitación doble corredor este (= 205px)

// Corredor oeste tiene 13 simples (una más que el este) en el mismo ancho útil,
// así que las habitaciones son más estrechas. 13×93 + 12×3 = 1245 px (= 12×101 + 11×3).
const COR_OESTE_W  = 95
const COR_OESTE_W2 = COR_OESTE_W * 2 + GAP   // (= 189px)

// ── Posiciones de origen de cada sección ─────────────────────────────────────

const ALA_SUR_Y       = 143  // y donde empieza el ala sur
const ALA_NORTE_EXT_Y = 4  // y donde empieza la col exterior del ala norte
const ALA_NORTE_INT_Y = 142   // y donde empieza la col interior del ala norte

const ALA_SUR_X       = 5   // x columna exterior ala sur
const ALA_SUR_COL_GAP = 60   // separación entre columna exterior e interior del ala sur
                              // columna interior = ALA_SUR_X + ALA_SUR_W + ALA_SUR_COL_GAP

const COR_X           = 5   // x donde empieza el primer hueco de los corredores

const ALA_NORTE_COL_GAP = 60   // separación entre columna interior y exterior del ala norte
const ALA_NORTE_X_EXT = 1500 - 10 - ALA_NORTE_W                        // x columna exterior ala norte (= 1280)
const ALA_NORTE_X_INT = ALA_NORTE_X_EXT - ALA_NORTE_W - ALA_NORTE_COL_GAP // x columna interior ala norte

const COR_OESTE_Y     = 3    // y fila superior corredor oeste
const COR_ESTE_Y      = 720  // y fila superior corredor este

// ── Ala Sur (101-118) ────────────────────────────────────────────────────────
// Columna exterior — 12 hab simples, de arriba a abajo:
const alaSurExt = [101, 102, 103, 105, 106, 108, 109, 111, 112, 114, 115, 118]
// Columna interior —  6 hab dobles, de arriba a abajo:
const alaSurInt = [104, 107, 110, 113, 116, 117]

const alaSur = []
for (let i = 0; i < alaSurExt.length; i++) {
  alaSur.push({ numero: String(alaSurExt[i]), x: ALA_SUR_X,                   y: ALA_SUR_Y + i * (ALA_SUR_H  + GAP), w: ALA_SUR_W, h: ALA_SUR_H  })
}
for (let i = 0; i < alaSurInt.length; i++) {
  alaSur.push({ numero: String(alaSurInt[i]), x: ALA_SUR_X + ALA_SUR_W + ALA_SUR_COL_GAP, y: ALA_SUR_Y + i * (ALA_SUR_H2 + GAP), w: ALA_SUR_W, h: ALA_SUR_H2 })
}

// ── Corredor Este (119-136) ──────────────────────────────────────────────────
// Fila superior —  6 hab dobles, de izq a der:
const corEsteSup = [121, 124, 127, 130, 133, 136]
// Fila inferior — 12 hab simples, de izq a der:
const corEsteInf = [119, 120, 122, 123, 125, 126, 128, 129, 131, 132, 134, 135]

const corEste = []
for (let i = 0; i < corEsteSup.length; i++) {
  corEste.push({ numero: String(corEsteSup[i]), x: COR_X + i * (COR_W2 + GAP), y: COR_ESTE_Y,                w: COR_W2, h: COR_H })
}
for (let i = 0; i < corEsteInf.length; i++) {
  corEste.push({ numero: String(corEsteInf[i]), x: COR_X + i * (COR_W  + GAP), y: COR_ESTE_Y + COR_H + GAP, w: COR_W,  h: COR_H })
}

// ── Ala Norte (137-157) ──────────────────────────────────────────────────────
// Columna exterior — 15 hab simples, de arriba a abajo:
//   (157 queda sola en la parte superior; 138 y 137 solas en la inferior)
const alaNorteExt = [157, 155, 154, 152, 151, 149, 148, 146, 145, 143, 142, 140, 139, 138, 137]
// Columna interior —  6 hab dobles, de arriba a abajo:
//   (empieza una fila más abajo, alineada con la segunda hab de la col exterior)
const alaNorteInt = [156, 153, 150, 147, 144, 141]

const alaNorte = []
for (let i = 0; i < alaNorteExt.length; i++) {
  alaNorte.push({ numero: String(alaNorteExt[i]), x: ALA_NORTE_X_EXT, y: ALA_NORTE_EXT_Y + i * (ALA_NORTE_EXT_H  + GAP),                            w: ALA_NORTE_W, h: ALA_NORTE_EXT_H  })
}
for (let i = 0; i < alaNorteInt.length; i++) {
  alaNorte.push({ numero: String(alaNorteInt[i]), x: ALA_NORTE_X_INT, y: ALA_NORTE_INT_Y + i * (ALA_NORTE_INT_H2 + GAP), w: ALA_NORTE_W, h: ALA_NORTE_INT_H2 })
}

// ── Corredor Oeste (158-176) ─────────────────────────────────────────────────
// Fila superior — 13 hab simples, de izq a der (la 175 queda sola sin doble debajo):
const corOesteSup = [175, 174, 172, 171, 169, 168, 166, 165, 163, 162, 160, 159, 158]
// Fila inferior —  6 hab dobles, de izq a der (desplazadas 1 columna por la 175):
const corOesteInf = [176, 173, 170, 167, 164, 161]

const corOeste = []
for (let i = 0; i < corOesteSup.length; i++) {
  corOeste.push({ numero: String(corOesteSup[i]), x: COR_X + i * (COR_OESTE_W + GAP), y: COR_OESTE_Y, w: COR_OESTE_W, h: COR_H })
}
for (let i = 0; i < corOesteInf.length; i++) {
  corOeste.push({ numero: String(corOesteInf[i]), x: COR_X + (COR_OESTE_W + GAP) + i * (COR_OESTE_W2 + GAP), y: COR_OESTE_Y + COR_H + GAP, w: COR_OESTE_W2, h: COR_H })
}

export const rooms = [...alaSur, ...corEste, ...alaNorte, ...corOeste]

export const zones = []

export const labels = [
  { text: 'PRIMERA PLANTA', x: 778,  y: 430, fontSize: 28, fontWeight: 'bold', color: '#e0e0e0' },
  { text: 'Corredor Este',  x: 778,  y: 685, fontSize: 10, color: '#aaa' },
]

export const walls = []

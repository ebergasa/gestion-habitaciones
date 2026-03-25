// Primera Planta: habitaciones 101-175 (75 habitaciones)
// viewBox 1500×860 → ratio 1.74, encaja en A4 landscape 10mm márgenes sin cortes
//
// Distribución:
//   Ala sur      (101-118) — columna exterior simple + columna interior doble alto
//   Corredor este (119-136) — dos filas horizontales, parte inferior
//   Ala norte    (137-157) — columna interior doble alto + columna exterior simple
//   Corredor oeste (158-175) — dos filas horizontales, parte superior

export const viewBox = '0 0 1500 860'

// ── Tamaños ───────────────────────────────────────────────────────────────────

const GAP    = 3    // separación entre habitaciones

const ALA_W     = 210    // ancho de habitación en el ala derecha
const ALA_IZQ_W = 200   // ancho de habitación en el ala izquierda
const ALA_H  = 45   // alto de habitación simple en las alas
const ALA_H2 = ALA_H * 2 + GAP   // alto de habitación doble (= 87px)

const COR_W  = 100   // ancho de habitación simple en los corredores (12 cols: 12×83+11×3 = 1029px)
const COR_H  = 67   // alto de habitación en los corredores
const COR_W2 = COR_W * 2 + GAP   // ancho de habitación doble (= 169px)

// ── Posiciones de origen de cada sección ─────────────────────────────────────

const ALA_IZQ_Y     = 143   // y donde empieza el ala izquierda
const ALA_DER_Y     = 97   // y donde empieza el ala derecha

const ALA_IZQ_X     = 10    // x columna exterior ala izquierda
                             // columna interior = ALA_IZQ_X + ALA_IZQ_W + GAP = 133

const COR_X         = 30   // x donde empieza el primer hueco de los corredores (justo después del ala izq: 10+120+3+120+10)

const ALA_DER_X_EXT = 1500 - 10 - ALA_W             // x columna exterior ala derecha (= 1400)
const ALA_DER_X_INT = ALA_DER_X_EXT - ALA_W - GAP   // x columna interior ala derecha (= 1307)

const COR_NOR_Y     = 3     // y fila superior corredor oeste
const COR_SUR_Y     = 720   // y fila superior corredor este

// ── Ala sur (101-118) ────────────────────────────────────────────────────────
// Columna exterior — 12 hab simples, de arriba a abajo:
const alaIzqExt = [101, 102, 104, 105, 107, 108, 110, 111, 113, 114, 116, 117]
// Columna interior —  6 hab dobles, de arriba a abajo:
const alaIzqInt = [103, 106, 109, 112, 115, 118]

const alaIzq = []
for (let i = 0; i < alaIzqExt.length; i++) {
  alaIzq.push({ numero: String(alaIzqExt[i]), x: ALA_IZQ_X,                   y: ALA_IZQ_Y + i * (ALA_H  + GAP), w: ALA_IZQ_W, h: ALA_H  })
}
for (let i = 0; i < alaIzqInt.length; i++) {
  alaIzq.push({ numero: String(alaIzqInt[i]), x: ALA_IZQ_X + ALA_IZQ_W + GAP, y: ALA_IZQ_Y + i * (ALA_H2 + GAP), w: ALA_IZQ_W, h: ALA_H2 })
}

// ── Corredor este (119-136) ───────────────────────────────────────────────────
// Fila superior —  6 hab dobles, de izq a der:
const corSurSup = [121, 124, 127, 130, 133, 136]
// Fila inferior — 12 hab simples, de izq a der:
const corSurInf = [119, 120, 122, 123, 125, 126, 128, 129, 131, 132, 134, 135]

const corridorBottom = []
for (let i = 0; i < corSurSup.length; i++) {
  corridorBottom.push({ numero: String(corSurSup[i]), x: COR_X + i * (COR_W2 + GAP), y: COR_SUR_Y,                w: COR_W2, h: COR_H })
}
for (let i = 0; i < corSurInf.length; i++) {
  corridorBottom.push({ numero: String(corSurInf[i]), x: COR_X + i * (COR_W  + GAP), y: COR_SUR_Y + COR_H + GAP, w: COR_W,  h: COR_H })
}

// ── Ala norte (137-157) ──────────────────────────────────────────────────────
// Columna exterior — 15 hab simples, de arriba a abajo:
//   (157 queda sola en la parte superior; 138 y 137 solas en la inferior)
const alaDerExt = [157, 155, 154, 152, 151, 149, 148, 146, 145, 143, 142, 140, 139, 138, 137]
// Columna interior —  6 hab dobles, de arriba a abajo:
//   (empieza una fila más abajo, alineada con la segunda hab de la col exterior)
const alaDerInt = [156, 153, 150, 147, 144, 141]

const alaDer = []
for (let i = 0; i < alaDerExt.length; i++) {
  alaDer.push({ numero: String(alaDerExt[i]), x: ALA_DER_X_EXT, y: ALA_DER_Y + i * (ALA_H  + GAP),                w: ALA_W, h: ALA_H  })
}
for (let i = 0; i < alaDerInt.length; i++) {
  alaDer.push({ numero: String(alaDerInt[i]), x: ALA_DER_X_INT, y: ALA_DER_Y + (ALA_H + GAP) + i * (ALA_H2 + GAP), w: ALA_W, h: ALA_H2 })
}

// ── Corredor oeste (158-175) ─────────────────────────────────────────────────
// Fila superior — 12 hab simples, de izq a der:
const corNorSup = [174, 173, 171, 170, 168, 167, 165, 164, 162, 161, 159, 158]
// Fila inferior —  6 hab dobles, de izq a der:
const corNorInf = [175, 172, 169, 166, 163, 160]

const corridorTop = []
for (let i = 0; i < corNorSup.length; i++) {
  corridorTop.push({ numero: String(corNorSup[i]), x: COR_X + i * (COR_W  + GAP), y: COR_NOR_Y,                w: COR_W,  h: COR_H })
}
for (let i = 0; i < corNorInf.length; i++) {
  corridorTop.push({ numero: String(corNorInf[i]), x: COR_X + i * (COR_W2 + GAP), y: COR_NOR_Y + COR_H + GAP, w: COR_W2, h: COR_H })
}

export const rooms = [...alaIzq, ...corridorBottom, ...alaDer, ...corridorTop]

export const zones = []

export const labels = [
  { text: 'PRIMERA PLANTA', x: 778,  y: 430, fontSize: 28, fontWeight: 'bold', color: '#e0e0e0' },
  { text: 'Ala Sur',        x: 132,  y: 85, fontSize: 10, color: '#aaa' },
  { text: 'Ala Norte',      x: 1400, y: 85, fontSize: 10, color: '#aaa' },
  { text: 'Corredor Oeste', x: 778,  y: 5,   fontSize: 10, color: '#aaa' },
  { text: 'Corredor Este',  x: 778,  y: 685, fontSize: 10, color: '#aaa' },
]

export const walls = []

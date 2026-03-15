// Primera Planta: habitaciones 101-175 (75 habitaciones)
// Layout perimetral: ala izquierda, ala derecha, corredor superior, corredor inferior

export const viewBox = '0 0 1100 700'

const W = 75  // ancho habitación
const H = 52  // alto habitación
const GAP = 2 // separación

// Ala izquierda: 101-119 (19 hab) — vertical, lado izquierdo
const alaIzq = []
for (let i = 0; i < 19; i++) {
  alaIzq.push({
    numero: String(101 + i),
    x: 15,
    y: 80 + i * (H + GAP),
    w: W,
    h: H
  })
}

// Ala derecha: 120-138 (19 hab) — vertical, lado derecho
const alaDer = []
for (let i = 0; i < 19; i++) {
  alaDer.push({
    numero: String(120 + i),
    x: 1010,
    y: 80 + i * (H + GAP),
    w: W,
    h: H
  })
}

// Corredor superior: 139-157 (19 hab) — horizontal, parte superior
const corridorTop = []
for (let i = 0; i < 19; i++) {
  corridorTop.push({
    numero: String(139 + i),
    x: 100 + i * (W + GAP),
    y: 15,
    w: W,
    h: H
  })
}

// Corredor inferior: 158-175 (18 hab) — horizontal, parte inferior
const corridorBottom = []
for (let i = 0; i < 18; i++) {
  corridorBottom.push({
    numero: String(158 + i),
    x: 100 + i * (W + GAP),
    y: 635,
    w: W,
    h: H
  })
}

export const rooms = [...alaIzq, ...alaDer, ...corridorTop, ...corridorBottom]

export const labels = [
  { text: 'Primera Planta', x: 550, y: 360, fontSize: 22, fontWeight: 'bold', color: '#ccc' },
  { text: 'Ala Izquierda', x: 52, y: 65, fontSize: 11, color: '#888' },
  { text: 'Ala Derecha', x: 1048, y: 65, fontSize: 11, color: '#888' },
  { text: 'Corredor Norte', x: 550, y: 44, fontSize: 11, color: '#888' },
  { text: 'Corredor Sur', x: 550, y: 626, fontSize: 11, color: '#888' },
]

export const walls = []

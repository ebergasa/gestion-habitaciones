// Segunda Planta: habitaciones 201-239 (39 habitaciones)
// Layout perimetral: ala izquierda, ala derecha, corredor superior

export const viewBox = '0 0 1100 500'

const W = 80
const H = 55
const GAP = 2

// Ala izquierda: 201-210 (10 hab)
const alaIzq = []
for (let i = 0; i < 10; i++) {
  alaIzq.push({
    numero: String(201 + i),
    x: 15,
    y: 80 + i * (H + GAP),
    w: W,
    h: H
  })
}

// Ala derecha: 211-220 (10 hab)
const alaDer = []
for (let i = 0; i < 10; i++) {
  alaDer.push({
    numero: String(211 + i),
    x: 1005,
    y: 80 + i * (H + GAP),
    w: W,
    h: H
  })
}

// Corredor superior: 221-239 (19 hab)
const corridorTop = []
for (let i = 0; i < 19; i++) {
  corridorTop.push({
    numero: String(221 + i),
    x: 105 + i * (W + GAP),
    y: 15,
    w: W,
    h: H
  })
}

export const rooms = [...alaIzq, ...alaDer, ...corridorTop]

export const labels = [
  { text: 'Segunda Planta', x: 550, y: 300, fontSize: 22, fontWeight: 'bold', color: '#ccc' },
  { text: 'Ala Izquierda', x: 55, y: 65, fontSize: 11, color: '#888' },
  { text: 'Ala Derecha', x: 1045, y: 65, fontSize: 11, color: '#888' },
  { text: 'Corredor Norte', x: 550, y: 44, fontSize: 11, color: '#888' },
]

export const walls = []

// Planta Baja: habitaciones 1–13 en corredor inferior
// Zonas comunes en lados y parte superior (igual que el Excel)

export const viewBox = '0 0 1100 620'

const RW = 63   // ancho habitación individual
const RH = 55   // alto habitación
const G  = 3    // gap

// Corredor inferior: 1–13 de izquierda a derecha
const corridorBottom = []
const startX = 160
for (let i = 0; i < 13; i++) {
  corridorBottom.push({
    numero: String(i + 1),
    x: startX + i * (RW + G),
    y: 505,
    w: RW, h: RH
  })
}

export const rooms = [...corridorBottom]

// Zonas comunes (solo decorativas, sin interacción)
export const zones = [
  { text: 'Despacho\nMédico',       x: 15,   y: 15,  w: 120, h: 80  },
  { text: 'Terapia\nOcupacional',   x: 15,   y: 110, w: 120, h: 130 },
  { text: 'Comedor',                x: 15,   y: 255, w: 120, h: 220 },
  { text: 'Peluquería',             x: 160,  y: 15,  w: 120, h: 55  },
  { text: 'Fisioterapia',           x: 283,  y: 15,  w: 220, h: 55  },
  { text: 'Recepción',              x: 506,  y: 15,  w: 150, h: 55  },
  { text: 'Administración',         x: 659,  y: 15,  w: 200, h: 55  },
  { text: 'TASOC',                  x: 862,  y: 15,  w: 150, h: 55  },
  { text: 'Sala\nVisitas',          x: 1025, y: 15,  w: 60,  h: 70  },
  { text: 'Psicología',             x: 1025, y: 100, w: 60,  h: 60  },
  { text: 'Capilla',                x: 1025, y: 175, w: 60,  h: 60  },
  { text: 'Sala TV',                x: 1025, y: 250, w: 60,  h: 170 },
  { text: 'Sala\nVisitas',          x: 1025, y: 435, w: 60,  h: 60  },
  { text: 'WC',                     x: 1025, y: 510, w: 60,  h: 55  },
]

export const labels = [
  { text: 'PLANTA BAJA', x: 570, y: 280, fontSize: 26, fontWeight: 'bold', color: '#ccc' },
]

export const walls = []

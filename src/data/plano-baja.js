// Planta Baja: habitaciones 1-13
// Layout perimetral en un espacio más reducido

export const viewBox = '0 0 900 500'

export const rooms = [
  // Ala izquierda (habitaciones 1-4)
  { numero: '1',  x: 20,  y: 80,  w: 90, h: 60 },
  { numero: '2',  x: 20,  y: 145, w: 90, h: 60 },
  { numero: '3',  x: 20,  y: 210, w: 90, h: 60 },
  { numero: '4',  x: 20,  y: 275, w: 90, h: 60 },

  // Corredor inferior (habitaciones 5-9)
  { numero: '5',  x: 130, y: 390, w: 80, h: 60 },
  { numero: '6',  x: 215, y: 390, w: 80, h: 60 },
  { numero: '7',  x: 300, y: 390, w: 80, h: 60 },
  { numero: '8',  x: 385, y: 390, w: 80, h: 60 },
  { numero: '9',  x: 470, y: 390, w: 80, h: 60 },

  // Ala derecha (habitaciones 10-13)
  { numero: '10', x: 790, y: 80,  w: 90, h: 60 },
  { numero: '11', x: 790, y: 145, w: 90, h: 60 },
  { numero: '12', x: 790, y: 210, w: 90, h: 60 },
  { numero: '13', x: 790, y: 275, w: 90, h: 60 },
]

export const labels = [
  { text: 'Planta Baja', x: 450, y: 40, fontSize: 18, fontWeight: 'bold' },
  { text: 'Zonas Comunes', x: 430, y: 240, fontSize: 14, color: '#999' },
]

export const walls = [
  // Perímetro exterior
  { x: 10, y: 60, w: 880, h: 420, fill: 'none', stroke: '#999', strokeWidth: 2 }
]

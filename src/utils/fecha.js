/**
 * Convierte una fecha en formato ISO (YYYY-MM-DD) al formato español DD/MM/AAAA.
 * Devuelve '—' si el valor es nulo, vacío o no tiene el formato esperado.
 */
export function fmtFecha(fecha) {
  if (!fecha) return '—'
  const partes = String(fecha).split('-')
  if (partes.length !== 3) return fecha
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

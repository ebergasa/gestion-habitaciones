import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useHabitacionesStore = defineStore('habitaciones', () => {
  const habitaciones = ref([])
  const cargando = ref(false)

  async function cargar() {
    cargando.value = true
    habitaciones.value = await window.api.getHabitacionesConOcupacion()
    cargando.value = false
  }

  const stats = computed(() => {
    const totalResidentes = habitaciones.value.reduce((s, h) => s + h.ocupaciones.length, 0)
    const totalPlazas = habitaciones.value.reduce((s, h) => s + h.capacidad, 0)

    let ocupadas = 0, libres = 0, parciales = 0, plazasLibres = 0

    for (const h of habitaciones.value) {
      const n = h.ocupaciones.length
      if (n === 0) {
        libres++
        plazasLibres += h.capacidad
      } else if (n < h.capacidad) {
        parciales++
        ocupadas++
        plazasLibres += h.capacidad - n
      } else {
        ocupadas++
      }
    }

    return { totalResidentes, totalPlazas, ocupadas, libres, parciales, plazasLibres }
  })

  function colorHabitacion(h) {
    const n = h.ocupaciones.length
    if (n === 0) return '#4CAF50'
    if (n < h.capacidad) return '#FF9800'
    return '#FFFFFF'
  }

  return { habitaciones, cargando, cargar, stats, colorHabitacion }
})

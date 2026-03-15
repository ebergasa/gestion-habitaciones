import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useResidentesStore = defineStore('residentes', () => {
  const residentes = ref([])
  const cargando = ref(false)

  async function cargar() {
    cargando.value = true
    residentes.value = await window.api.getResidentes()
    cargando.value = false
  }

  async function crear(data) {
    await window.api.createResidente({ ...data })
    await cargar()
  }

  async function actualizar(id, data) {
    await window.api.updateResidente(id, { ...data })
    await cargar()
  }

  async function eliminar(id) {
    await window.api.deleteResidente(id)
    await cargar()
  }

  return { residentes, cargando, cargar, crear, actualizar, eliminar }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const nombreResidencia = ref('Residencia')
  const logo = ref(null)

  async function cargar() {
    const cfg = await window.api.getConfig()
    nombreResidencia.value = cfg.nombreResidencia
    logo.value = cfg.logo
  }

  async function guardarNombre(nombre) {
    await window.api.setNombreResidencia(nombre)
    nombreResidencia.value = nombre
  }

  async function seleccionarLogo() {
    const dataUrl = await window.api.seleccionarLogo()
    if (dataUrl) logo.value = dataUrl
    return dataUrl
  }

  async function eliminarLogo() {
    await window.api.deleteLogo()
    logo.value = null
  }

  return { nombreResidencia, logo, cargar, guardarNombre, seleccionarLogo, eliminarLogo }
})

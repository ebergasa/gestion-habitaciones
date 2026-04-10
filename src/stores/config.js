import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const nombreResidencia = ref('Residencia')
  const logoPath = ref(null)

  // Convierte ruta Windows (local o UNC) a URL file:// para usar en <img src>
  const logoUrl = computed(() => {
    if (!logoPath.value) return null
    const p = logoPath.value
    // Ruta UNC: \\servidor\recurso\... → file:////servidor/recurso/...
    if (p.startsWith('\\\\')) {
      return 'file:////' + p.slice(2).replace(/\\/g, '/')
    }
    // Ruta absoluta local: C:\... → file:///C:/...
    return 'file:///' + p.replace(/\\/g, '/')
  })

  async function cargar() {
    const cfg = await window.api.getConfig()
    nombreResidencia.value = cfg.nombreResidencia
    logoPath.value = cfg.logoPath
  }

  async function guardarNombre(nombre) {
    await window.api.setNombreResidencia(nombre)
    nombreResidencia.value = nombre
  }

  async function seleccionarLogo() {
    const path = await window.api.seleccionarLogo()
    if (path) logoPath.value = path
    return path
  }

  async function eliminarLogo() {
    await window.api.deleteLogo()
    logoPath.value = null
  }

  return { nombreResidencia, logoPath, logoUrl, cargar, guardarNombre, seleccionarLogo, eliminarLogo }
})

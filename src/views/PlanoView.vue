<template>
  <div class="page">
    <!-- Cabecera de impresión (solo visible al imprimir) -->
    <div class="print-header">
      <img v-if="cfg.logo" :src="cfg.logo" class="print-logo" alt="Logo" />
      <div class="print-header-texto">
        <div class="print-nombre">{{ cfg.nombreResidencia }}</div>
        <div class="print-subtitulo">Plano de ocupación · {{ plantaActualLabel }} · {{ fechaHoy }}</div>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-value">{{ stats.totalResidentes }}</div>
        <div class="stat-label">Total residentes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.ocupadas }}</div>
        <div class="stat-label">Habitaciones ocupadas</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.libres }}</div>
        <div class="stat-label">Habitaciones libres</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.plazasLibres }}</div>
        <div class="stat-label">Plazas libres</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.parciales }}</div>
        <div class="stat-label">Habitaciones parciales</div>
      </div>
    </div>

    <!-- Controles -->
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
      <div class="tabs">
        <button class="tab-btn" :class="{ active: planta==='baja' }" @click="planta='baja'">Planta Baja</button>
        <button class="tab-btn" :class="{ active: planta==='primera' }" @click="planta='primera'">Primera Planta</button>
        <button class="tab-btn" :class="{ active: planta==='segunda' }" @click="planta='segunda'">Segunda Planta</button>
      </div>
      <button class="btn btn-outline" @click="imprimir">🖨 Imprimir plano</button>
    </div>

    <!-- Leyenda -->
    <div class="leyenda">
      <div class="leyenda-item">
        <div class="leyenda-color" style="background:#4CAF50"></div>
        <span>Libre</span>
      </div>
      <div class="leyenda-item">
        <div class="leyenda-color" style="background:#FF9800"></div>
        <span>Parcialmente ocupada</span>
      </div>
      <div class="leyenda-item">
        <div class="leyenda-color" style="background:#FFFFFF; border:1px solid #999;"></div>
        <span>Completamente ocupada</span>
      </div>
    </div>

    <!-- Plano SVG -->
    <div class="plano-container" v-if="!cargando">
      <PlantaBaja v-if="planta==='baja'" @clickHabitacion="abrirHabitacion" />
      <PrimeraPlanta v-if="planta==='primera'" @clickHabitacion="abrirHabitacion" />
      <SegundaPlanta v-if="planta==='segunda'" @clickHabitacion="abrirHabitacion" />
    </div>
    <div v-else class="alert alert-info">Cargando plano…</div>

    <!-- Modal -->
    <HabitacionModal
      v-if="habitacionSeleccionada"
      :habitacion="habitacionSeleccionada"
      @cerrar="habitacionSeleccionada = null"
      @actualizado="onActualizado"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitacionesStore } from '@/stores/habitaciones'
import { useConfigStore } from '@/stores/config.js'
import PlantaBaja from '@/components/planos/PlantaBaja.vue'
import PrimeraPlanta from '@/components/planos/PrimeraPlanta.vue'
import SegundaPlanta from '@/components/planos/SegundaPlanta.vue'
import HabitacionModal from '@/components/HabitacionModal.vue'

const store = useHabitacionesStore()
const cfg = useConfigStore()
const planta = ref('primera')
const habitacionSeleccionada = ref(null)
const { cargando, stats } = store

const plantaActualLabel = computed(() =>
  ({ baja: 'Planta Baja', primera: 'Primera Planta', segunda: 'Segunda Planta' })[planta.value]
)
const fechaHoy = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })

onMounted(() => store.cargar())

function abrirHabitacion(numero) {
  const h = store.habitaciones.find(h => h.numero === numero)
  if (h) habitacionSeleccionada.value = { ...h }
}

async function onActualizado() {
  await store.cargar()
  // Refrescar la habitación seleccionada con datos nuevos
  if (habitacionSeleccionada.value) {
    const h = store.habitaciones.find(h => h.numero === habitacionSeleccionada.value.numero)
    if (h) habitacionSeleccionada.value = { ...h }
  }
}

function imprimir() {
  window.print()
}
</script>

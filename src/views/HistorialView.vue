<template>
  <div class="page">
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
      <h1 style="font-size:20px; font-weight:600;">Historial de ocupaciones</h1>
      <button class="btn btn-outline" @click="exportar">📥 Exportar Excel</button>
    </div>

    <!-- Filtros -->
    <div class="filtros" style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
      <div class="form-group" style="margin:0; min-width:160px;">
        <label>Planta</label>
        <select v-model="filtros.planta">
          <option value="">Todas</option>
          <option value="baja">Planta Baja</option>
          <option value="primera">Primera Planta</option>
          <option value="segunda">Segunda Planta</option>
        </select>
      </div>
      <div class="form-group" style="margin:0;">
        <label>Desde</label>
        <input type="date" v-model="filtros.desde" />
      </div>
      <div class="form-group" style="margin:0;">
        <label>Hasta</label>
        <input type="date" v-model="filtros.hasta" />
      </div>
      <div class="form-group" style="margin:0; min-width:200px;">
        <label>Residente</label>
        <input type="text" v-model="filtros.nombreResidente" placeholder="Nombre o apellidos…" />
      </div>
      <div class="form-group" style="margin:0; min-width:180px;">
        <label>Motivo de salida</label>
        <select v-model="filtros.motivoId">
          <option value="">Todos</option>
          <option v-for="m in motivos" :key="m.id" :value="m.id">{{ m.id }} – {{ m.nombre }}</option>
        </select>
      </div>
      <div style="display:flex; align-items:flex-end; gap:8px;">
        <button class="btn btn-primary" @click="cargar">Filtrar</button>
        <button class="btn btn-outline" @click="limpiarFiltros">Limpiar</button>
      </div>
    </div>

    <div v-if="cargando" class="alert alert-info">Cargando historial…</div>

    <div class="table-wrap" v-else style="background:white; border-radius:8px; border:1px solid var(--color-border);">
      <table>
        <thead>
          <tr>
            <th>Habitación</th>
            <th>Planta</th>
            <th>Residente</th>
            <th>DNI</th>
            <th>Cód. Residente</th>
            <th>Fecha entrada</th>
            <th>Fecha salida</th>
            <th>Motivo salida</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!historialFiltrado.length">
            <td colspan="9" style="text-align:center; padding:24px; color:#999;">Sin resultados</td>
          </tr>
          <tr v-for="oc in historialFiltrado" :key="oc.id">
            <td><strong>{{ oc.habitacion_numero }}</strong></td>
            <td>{{ plantaLabel(oc.planta) }}</td>
            <td>{{ oc.apellidos }}, {{ oc.nombre }}</td>
            <td>{{ oc.dni || '—' }}</td>
            <td>{{ oc.codigo_externo || '—' }}</td>
            <td>{{ oc.fecha_entrada }}</td>
            <td>
              <span v-if="oc.fecha_salida">{{ oc.fecha_salida }}</span>
              <span v-else class="badge badge-ocupada">Activa</span>
            </td>
            <td>{{ oc.motivo_nombre || '—' }}</td>
            <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" :title="oc.notas">{{ oc.notas || '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top:8px; font-size:12px; color:#888;">
      {{ historialFiltrado.length }} registro(s)
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const historial = ref([])
const motivos = ref([])
const cargando = ref(false)
const filtros = ref({ planta: '', desde: '', hasta: '', nombreResidente: '', motivoId: '' })

onMounted(async () => {
  motivos.value = await window.api.getMotivosAlta()
  await cargar()
})

async function cargar() {
  cargando.value = true
  historial.value = await window.api.getHistorial({
    planta: filtros.value.planta || undefined,
    desde: filtros.value.desde || undefined,
    hasta: filtros.value.hasta || undefined
  })
  cargando.value = false
}

const historialFiltrado = computed(() => {
  let h = historial.value
  if (filtros.value.nombreResidente) {
    const q = filtros.value.nombreResidente.toLowerCase()
    h = h.filter(r => `${r.nombre} ${r.apellidos}`.toLowerCase().includes(q))
  }
  if (filtros.value.motivoId) {
    h = h.filter(r => r.motivo_id === filtros.value.motivoId)
  }
  return h
})

function limpiarFiltros() {
  filtros.value = { planta: '', desde: '', hasta: '', nombreResidente: '', motivoId: '' }
  cargar()
}

async function exportar() {
  const ruta = await window.api.seleccionarRutaExcel()
  if (!ruta) return
  await window.api.exportarExcel(ruta)
  alert('Excel exportado correctamente.')
}

function plantaLabel(p) {
  return { baja: 'Planta Baja', primera: 'Primera Planta', segunda: 'Segunda Planta' }[p] || p
}
</script>

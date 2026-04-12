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
        <label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; padding-bottom:6px;">
          <input type="checkbox" v-model="filtros.soloActivas" />
          Solo activas
        </label>
        <button class="btn btn-primary" @click="cargar">Filtrar</button>
        <button class="btn btn-outline" @click="limpiarFiltros">Limpiar</button>
      </div>
    </div>

    <div v-if="cargando" class="alert alert-info">Cargando historial…</div>

    <div class="table-wrap" v-else style="background:white; border-radius:8px; border:1px solid var(--color-border);">
      <table>
        <thead>
          <tr>
            <th class="th-sort" @click="ordenar('habitacion_numero')">
              Habitación <span class="sort-icon">{{ icono('habitacion_numero') }}</span>
            </th>
            <th class="th-sort" @click="ordenar('planta')">
              Planta <span class="sort-icon">{{ icono('planta') }}</span>
            </th>
            <th class="th-sort" @click="ordenar('residente')">
              Residente <span class="sort-icon">{{ icono('residente') }}</span>
            </th>
            <th class="th-sort" @click="ordenar('codigo_externo')">
              Cód. Residente <span class="sort-icon">{{ icono('codigo_externo') }}</span>
            </th>
            <th class="th-sort" @click="ordenar('fecha_entrada')">
              Fecha entrada <span class="sort-icon">{{ icono('fecha_entrada') }}</span>
            </th>
            <th class="th-sort" @click="ordenar('fecha_salida')">
              Fecha salida <span class="sort-icon">{{ icono('fecha_salida') }}</span>
            </th>
            <th class="th-sort" @click="ordenar('motivo_nombre')">
              Motivo salida <span class="sort-icon">{{ icono('motivo_nombre') }}</span>
            </th>
            <th class="th-sort" @click="ordenar('updated_at')">
              Últ. modificación <span class="sort-icon">{{ icono('updated_at') }}</span>
            </th>
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
            <td>{{ oc.codigo_externo || '—' }}</td>
            <td>{{ fmtFecha(oc.fecha_entrada) }}</td>
            <td>
              <span v-if="oc.fecha_salida">{{ fmtFecha(oc.fecha_salida) }}</span>
              <span v-else class="badge badge-ocupada">Activa</span>
            </td>
            <td>{{ oc.motivo_nombre || '—' }}</td>
            <td>{{ fmtFecha(oc.updated_at) }}</td>
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
import { fmtFecha } from '@/utils/fecha.js'
import { normalizar } from '@/utils/normalizar.js'

const historial = ref([])
const motivos = ref([])
const cargando = ref(false)
const filtros = ref({ planta: '', desde: '', hasta: '', nombreResidente: '', motivoId: '', soloActivas: false })

const sortCol = ref('fecha_entrada')
const sortDir = ref('desc')

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
    const q = normalizar(filtros.value.nombreResidente)
    h = h.filter(r => normalizar(`${r.nombre} ${r.apellidos}`).includes(q))
  }
  if (filtros.value.motivoId) {
    h = h.filter(r => r.motivo_id === filtros.value.motivoId)
  }
  if (filtros.value.soloActivas) {
    h = h.filter(r => !r.fecha_salida)
  }

  const col = sortCol.value
  const dir = sortDir.value === 'asc' ? 1 : -1

  return [...h].sort((a, b) => {
    let va, vb
    if (col === 'habitacion_numero') {
      va = parseInt(a.habitacion_numero) || 0
      vb = parseInt(b.habitacion_numero) || 0
    } else if (col === 'residente') {
      va = normalizar(`${a.apellidos} ${a.nombre}`)
      vb = normalizar(`${b.apellidos} ${b.nombre}`)
    } else {
      va = a[col]
      vb = b[col]
    }

    if (va == null && vb == null) return 0
    if (va == null) return 1
    if (vb == null) return -1

    if (typeof va === 'number') return (va - vb) * dir
    return String(va).localeCompare(String(vb), 'es') * dir
  })
})

function ordenar(col) {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = col
    sortDir.value = 'asc'
  }
}

function icono(col) {
  if (sortCol.value !== col) return '↕'
  return sortDir.value === 'asc' ? '↑' : '↓'
}

function limpiarFiltros() {
  filtros.value = { planta: '', desde: '', hasta: '', nombreResidente: '', motivoId: '', soloActivas: false }
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

<style scoped>
.th-sort {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.th-sort:hover {
  background: #e8ecf0;
}
.sort-icon {
  font-size: 11px;
  color: #aaa;
  margin-left: 4px;
}
</style>

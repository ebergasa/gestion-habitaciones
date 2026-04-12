<template>
  <div class="page">
    <h1 style="font-size:20px; font-weight:600; margin-bottom:20px;">Buscador</h1>

    <!-- Formulario de búsqueda -->
    <div style="background:white; border:1px solid var(--color-border); border-radius:8px; padding:16px; margin-bottom:20px; display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
      <div class="form-group" style="margin:0;">
        <label>Modo de búsqueda</label>
        <select v-model="modo" style="min-width:180px;">
          <option value="habitacion">Por número de habitación</option>
          <option value="residente">Por nombre de residente</option>
          <option value="libres">Habitaciones libres</option>
        </select>
      </div>
      <div class="form-group" style="margin:0; flex:1; min-width:200px;" v-if="modo !== 'libres'">
        <label>{{ modo === 'habitacion' ? 'Número de habitación' : 'Nombre / apellidos' }}</label>
        <input
          type="text"
          v-model="query"
          :placeholder="modo === 'habitacion' ? 'Ej: 101' : 'Ej: García'"
          @keyup.enter="buscar"
        />
      </div>
      <button class="btn btn-primary" @click="buscar">Buscar</button>
    </div>

    <!-- Resultados: habitación -->
    <template v-if="modo === 'habitacion' && resultadoHab">
      <div class="search-results">
        <h2 style="font-size:16px; margin-bottom:16px;">
          Habitación {{ resultadoHab.habitacion.numero }} · {{ plantaLabel(resultadoHab.habitacion.planta) }}
          <span class="badge badge-info" style="margin-left:8px;">{{ resultadoHab.habitacion.tipo }}</span>
        </h2>

        <div style="margin-bottom:16px;">
          <h3 class="seccion-titulo">Residentes actuales</h3>
          <div v-if="!resultadoHab.actual.length" style="color:#999; font-size:13px;">Habitación libre</div>
          <div v-for="r in resultadoHab.actual" :key="r.ocupacion_id" class="search-result-card">
            <strong>{{ r.apellidos }}, {{ r.nombre }}</strong>
            <div style="font-size:12px; color:#666; margin-top:4px;">
              Entrada: {{ fmtFecha(r.fecha_entrada) }}
            </div>
          </div>
        </div>

        <div>
          <h3 class="seccion-titulo">Historial completo</h3>
          <div v-if="!resultadoHab.historial.length" style="color:#999; font-size:13px;">Sin historial</div>
          <table v-else style="width:100%; font-size:13px;">
            <thead>
              <tr>
                <th>Residente</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Motivo salida</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in resultadoHab.historial" :key="h.id">
                <td>{{ h.apellidos }}, {{ h.nombre }}</td>
                <td>{{ fmtFecha(h.fecha_entrada) }}</td>
                <td>{{ fmtFecha(h.fecha_salida) }}</td>
                <td>{{ h.motivo_nombre || '—' }}</td>
                <td>{{ h.notas || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Resultados: residente -->
    <template v-if="modo === 'residente' && resultadosRes.length">
      <div class="search-results">
        <h2 style="font-size:16px; margin-bottom:16px;">{{ resultadosRes.length }} residente(s) encontrado(s)</h2>
        <div v-for="r in resultadosRes" :key="r.id" class="search-result-card">
          <h3>{{ r.apellidos }}, {{ r.nombre }}
            <span v-if="r.habitacion_numero" class="badge badge-ocupada" style="margin-left:8px;">Hab. {{ r.habitacion_numero }}</span>
            <span v-else class="badge badge-libre" style="margin-left:8px;">Sin asignar</span>
          </h3>
          <div style="font-size:12px; color:#666; margin-bottom:10px;">
            Cód. residente: {{ r.codigo_externo || '—' }}
            <span v-if="r.fecha_entrada"> · Entrada: {{ fmtFecha(r.fecha_entrada) }}</span>
          </div>

          <div v-if="r.historial.length">
            <div style="font-weight:600; font-size:12px; color:#888; margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px;">Historial</div>
            <table style="width:100%; font-size:12px;">
              <thead>
                <tr>
                  <th>Habitación</th>
                  <th>Planta</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Motivo salida</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="h in r.historial" :key="h.id">
                  <td>{{ h.habitacion_numero }}</td>
                  <td>{{ plantaLabel(h.planta) }}</td>
                  <td>{{ fmtFecha(h.fecha_entrada) }}</td>
                  <td>{{ fmtFecha(h.fecha_salida) }}</td>
                  <td>{{ h.motivo_nombre || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <!-- Resultados: libres -->
    <template v-if="modo === 'libres' && habitacionesLibres !== null">
      <div class="search-results">
        <h2 style="font-size:16px; margin-bottom:16px;">{{ habitacionesLibres.length }} habitación(es) con plazas libres</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Habitación</th>
                <th>Planta</th>
                <th>Tipo</th>
                <th>Capacidad</th>
                <th>Plazas libres</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in habitacionesLibres" :key="h.id">
                <td>{{ h.numero }}</td>
                <td>{{ plantaLabel(h.planta) }}</td>
                <td>{{ h.tipo }}</td>
                <td>{{ h.capacidad }}</td>
                <td><span class="badge badge-libre">{{ h.plazas_libres }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <div v-if="sinResultados" class="alert alert-info">Sin resultados para la búsqueda.</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { fmtFecha } from '@/utils/fecha.js'

const modo = ref('habitacion')
const query = ref('')
const resultadoHab = ref(null)
const resultadosRes = ref([])
const habitacionesLibres = ref(null)
const sinResultados = ref(false)

watch(modo, () => {
  query.value = ''
  resultadoHab.value = null
  resultadosRes.value = []
  habitacionesLibres.value = null
  sinResultados.value = false
  if (modo.value === 'libres') buscar()
})

async function buscar() {
  sinResultados.value = false
  resultadoHab.value = null
  resultadosRes.value = []
  habitacionesLibres.value = null

  if (modo.value === 'habitacion') {
    const r = await window.api.buscarPorHabitacion(query.value.trim())
    if (r) resultadoHab.value = r
    else sinResultados.value = true
  } else if (modo.value === 'residente') {
    const r = await window.api.buscarPorResidente(query.value.trim())
    resultadosRes.value = r
    if (!r.length) sinResultados.value = true
  } else {
    habitacionesLibres.value = await window.api.getHabitacionesLibres()
  }
}

function plantaLabel(p) {
  return { baja: 'Planta Baja', primera: 'Primera Planta', segunda: 'Segunda Planta' }[p] || p
}
</script>

<style scoped>
.seccion-titulo { font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }
</style>

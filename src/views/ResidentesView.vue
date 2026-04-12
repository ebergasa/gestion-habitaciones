<template>
  <div class="page">
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
      <h1 style="font-size:20px; font-weight:600;">Residentes</h1>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-outline" @click="exportarExcel" :disabled="!residentesFiltrados.length">Exportar Excel</button>
        <button class="btn btn-primary" @click="abrirFormulario(null)">+ Nuevo residente</button>
      </div>
    </div>

    <!-- Búsqueda y filtros -->
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px; flex-wrap:wrap;">
      <div class="form-group" style="flex:1; min-width:260px; margin-bottom:0;">
        <input type="text" v-model="busqueda" placeholder="Buscar por nombre, apellidos o DNI…" />
      </div>
      <div class="form-group" style="margin-bottom:0; min-width:220px;">
        <select v-model="filtroAsignacion">
          <option value="">Todos los residentes</option>
          <option value="con_habitacion">Con habitación asignada ahora</option>
          <option value="sin_asignar">Sin historial de habitación</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-wrap" style="background:white; border-radius:8px; border:1px solid var(--color-border);">
      <table>
        <thead>
          <tr>
            <th>Apellidos, Nombre</th>
            <th>DNI</th>
            <th>Cód. Residente</th>
            <th>Habitación actual</th>
            <th>Fecha entrada</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!residentesFiltrados.length">
            <td colspan="6" style="text-align:center; padding:24px; color:#999;">
              {{ busqueda || filtroAsignacion ? 'Sin resultados' : 'No hay residentes registrados' }}
            </td>
          </tr>
          <tr v-for="r in residentesFiltrados" :key="r.id">
            <td><strong>{{ r.apellidos }}, {{ r.nombre }}</strong></td>
            <td>{{ r.dni || '—' }}</td>
            <td>{{ r.codigo_externo || '—' }}</td>
            <td>
              <span v-if="r.habitacion_numero" class="badge badge-ocupada">
                Hab. {{ r.habitacion_numero }}
              </span>
              <span v-else class="badge badge-libre">Sin asignar</span>
            </td>
            <td>{{ fmtFecha(r.fecha_entrada) }}</td>
            <td style="white-space:nowrap;">
              <button class="btn btn-sm btn-outline" @click="abrirFormulario(r)">Editar</button>
              <button
                class="btn btn-sm btn-danger"
                style="margin-left:6px"
                :disabled="!!r.habitacion_numero"
                :title="r.habitacion_numero ? 'Tiene habitación asignada' : ''"
                @click="confirmarEliminar(r)"
              >Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal formulario -->
    <div class="modal-overlay" v-if="mostrarForm" @click.self="mostrarForm = false">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editando ? 'Editar residente' : 'Nuevo residente' }}</h2>
          <button class="close-btn" @click="mostrarForm = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <div class="form-row">
            <div class="form-group">
              <label>Nombre *</label>
              <input ref="inputNombre" type="text" v-model="form.nombre" />
            </div>
            <div class="form-group">
              <label>Apellidos *</label>
              <input type="text" v-model="form.apellidos" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>DNI</label>
              <input type="text" v-model="form.dni" placeholder="Opcional" />
            </div>
            <div class="form-group">
              <label>Código de residente</label>
              <input type="text" v-model="form.codigo_externo" placeholder="Opcional" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="mostrarForm = false">Cancelar</button>
          <button class="btn btn-primary" @click="guardar">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useResidentesStore } from '@/stores/residentes'
import { normalizar } from '@/utils/normalizar.js'
import { fmtFecha } from '@/utils/fecha.js'

const store = useResidentesStore()
const busqueda = ref('')
const filtroAsignacion = ref('')
const mostrarForm = ref(false)
const editando = ref(null)
const error = ref('')
const form = ref({ nombre: '', apellidos: '', dni: '', codigo_externo: '' })
const inputNombre = ref(null)

onMounted(() => store.cargar())

const residentesFiltrados = computed(() => {
  const q = normalizar(busqueda.value)
  return store.residentes.filter(r => {
    if (filtroAsignacion.value === 'con_habitacion' && !r.habitacion_numero) return false
    if (filtroAsignacion.value === 'sin_asignar' && !r.nunca_asignado) return false
    if (!q) return true
    return normalizar(`${r.nombre} ${r.apellidos} ${r.dni || ''}`).includes(q)
  })
})

function abrirFormulario(r) {
  editando.value = r
  error.value = ''
  form.value = r
    ? { nombre: r.nombre, apellidos: r.apellidos, dni: r.dni || '', codigo_externo: r.codigo_externo || '' }
    : { nombre: '', apellidos: '', dni: '', codigo_externo: '' }
  mostrarForm.value = true
  nextTick(() => inputNombre.value?.focus())
}

async function guardar() {
  error.value = ''
  if (!form.value.nombre.trim()) { error.value = 'El nombre es obligatorio'; return }
  if (!form.value.apellidos.trim()) { error.value = 'Los apellidos son obligatorios'; return }
  try {
    if (editando.value) {
      await store.actualizar(editando.value.id, form.value)
    } else {
      await store.crear(form.value)
    }
    mostrarForm.value = false
  } catch (e) {
    error.value = e.message
  }
}

async function confirmarEliminar(r) {
  if (!confirm(`¿Eliminar a ${r.nombre} ${r.apellidos}?`)) return
  try {
    await store.eliminar(r.id)
  } catch (e) {
    alert(e.message)
  }
}

async function exportarExcel() {
  const fecha = new Date().toISOString().slice(0, 10)
  const ruta = await window.api.seleccionarRutaExcel(`residentes-${fecha}.xlsx`)
  if (!ruta) return
  try {
    await window.api.exportarResidentes(JSON.parse(JSON.stringify(residentesFiltrados.value)), ruta)
  } catch (e) {
    alert('Error al exportar: ' + e.message)
  }
}
</script>

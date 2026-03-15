<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')">
    <div class="modal">
      <div class="modal-header">
        <h2>Habitación {{ habitacion?.numero }} · {{ plantaLabel(habitacion?.planta) }}</h2>
        <button class="close-btn" @click="$emit('cerrar')">×</button>
      </div>

      <div class="modal-body" v-if="habitacion">
        <!-- Estado -->
        <div style="margin-bottom:16px; display:flex; gap:10px; align-items:center;">
          <span class="badge" :class="badgeEstado">{{ estadoTexto }}</span>
          <span style="font-size:12px; color:#888;">{{ habitacion.tipo === 'doble' ? 'Doble · 2 plazas' : 'Individual · 1 plaza' }}</span>
        </div>

        <!-- Residentes actuales -->
        <div v-if="habitacion.ocupaciones.length" class="seccion">
          <h3 class="seccion-titulo">Residentes actuales</h3>
          <div
            v-for="oc in habitacion.ocupaciones"
            :key="oc.ocupacion_id"
            class="residente-item"
          >
            <div class="residente-info">
              <strong>{{ oc.apellidos }}, {{ oc.nombre }}</strong>
              <span class="detalle">DNI: {{ oc.dni || '—' }}</span>
              <span class="detalle">Entrada: {{ oc.fecha_entrada }}</span>
            </div>
            <button class="btn btn-sm btn-danger" @click="iniciarAlta(oc)">
              Dar de alta
            </button>
          </div>
        </div>

        <!-- Formulario de alta -->
        <div v-if="ocupacionAlta" class="seccion seccion-alta">
          <h3 class="seccion-titulo">Alta de {{ ocupacionAlta.apellidos }}, {{ ocupacionAlta.nombre }}</h3>
          <div v-if="errorAlta" class="alert alert-error">{{ errorAlta }}</div>
          <div class="form-group">
            <label>Fecha de salida *</label>
            <input type="date" v-model="formAlta.fechaSalida" />
          </div>
          <div class="form-group">
            <label>Motivo de salida *</label>
            <select v-model="formAlta.motivoAltaId">
              <option value="">— Seleccionar motivo —</option>
              <option v-for="m in motivos" :key="m.id" :value="m.id">
                {{ m.id }} – {{ m.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Notas</label>
            <textarea v-model="formAlta.notas" rows="2" placeholder="Observaciones opcionales…"></textarea>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" @click="confirmarAlta">Confirmar alta</button>
            <button class="btn btn-outline" @click="ocupacionAlta = null">Cancelar</button>
          </div>
        </div>

        <!-- Asignar residente -->
        <div v-if="!ocupacionAlta && puedAsignar" class="seccion">
          <h3 class="seccion-titulo">Asignar residente</h3>
          <div v-if="errorAsignar" class="alert alert-error">{{ errorAsignar }}</div>
          <div class="form-group">
            <label>Buscar residente</label>
            <input
              type="text"
              v-model="busquedaResidente"
              placeholder="Nombre o apellidos…"
              @input="filtrarResidentes"
            />
          </div>
          <div v-if="residentesFiltrados.length" class="lista-residentes">
            <div
              v-for="r in residentesFiltrados"
              :key="r.id"
              class="residente-opcion"
              :class="{ 'residente-opcion--seleccionado': residenteSeleccionado?.id === r.id }"
              @click="seleccionarResidente(r)"
            >
              <span>{{ r.apellidos }}, {{ r.nombre }}</span>
              <span class="detalle">{{ r.dni || '' }}</span>
              <span v-if="r.habitacion_numero" class="badge badge-info" style="margin-left:auto">
                Hab. {{ r.habitacion_numero }}
              </span>
            </div>
          </div>
          <div v-if="residenteSeleccionado" class="form-group" style="margin-top:12px">
            <label>Fecha de entrada *</label>
            <input type="date" v-model="fechaEntrada" />
          </div>
          <button
            v-if="residenteSeleccionado"
            class="btn btn-primary"
            style="margin-top:8px"
            @click="asignar"
          >
            Asignar a habitación {{ habitacion.numero }}
          </button>
        </div>

        <div v-if="!puedAsignar && !ocupacionAlta" class="alert alert-info" style="margin-top:8px">
          La habitación está completa ({{ habitacion.ocupaciones.length }}/{{ habitacion.capacidad }} plazas).
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useHabitacionesStore } from '@/stores/habitaciones'
import { useResidentesStore } from '@/stores/residentes'
import { normalizar } from '@/utils/normalizar.js'

const props = defineProps({
  habitacion: Object
})
const emit = defineEmits(['cerrar', 'actualizado'])

const store = useHabitacionesStore()
const residentesStore = useResidentesStore()

const motivos = ref([])
const ocupacionAlta = ref(null)
const errorAlta = ref('')
const formAlta = ref({ fechaSalida: '', motivoAltaId: '', notas: '' })

const busquedaResidente = ref('')
const residentesFiltrados = ref([])
const residenteSeleccionado = ref(null)
const fechaEntrada = ref(hoy())
const errorAsignar = ref('')

watch(() => props.habitacion, (h) => {
  if (h) {
    ocupacionAlta.value = null
    busquedaResidente.value = ''
    residentesFiltrados.value = []
    residenteSeleccionado.value = null
    errorAsignar.value = ''
    errorAlta.value = ''
  }
}, { immediate: true })

onMounted(async () => {
  motivos.value = await window.api.getMotivosAlta()
  await residentesStore.cargar()
})

const puedAsignar = computed(() => {
  if (!props.habitacion) return false
  return props.habitacion.ocupaciones.length < props.habitacion.capacidad
})

const estadoTexto = computed(() => {
  const h = props.habitacion
  if (!h) return ''
  const n = h.ocupaciones.length
  if (n === 0) return 'Libre'
  if (n < h.capacidad) return 'Parcialmente ocupada'
  return 'Completa'
})

const badgeEstado = computed(() => {
  const h = props.habitacion
  if (!h) return ''
  const n = h.ocupaciones.length
  if (n === 0) return 'badge-libre'
  if (n < h.capacidad) return 'badge-parcial'
  return 'badge-ocupada'
})

function iniciarAlta(oc) {
  ocupacionAlta.value = oc
  formAlta.value = { fechaSalida: hoy(), motivoAltaId: '', notas: '' }
  errorAlta.value = ''
}

async function confirmarAlta() {
  errorAlta.value = ''
  if (!formAlta.value.fechaSalida) { errorAlta.value = 'Indica la fecha de salida'; return }
  if (!formAlta.value.motivoAltaId) { errorAlta.value = 'El motivo de salida es obligatorio'; return }
  try {
    await window.api.desasignarResidente(ocupacionAlta.value.ocupacion_id, {
      fechaSalida: formAlta.value.fechaSalida,
      motivoAltaId: formAlta.value.motivoAltaId,
      notas: formAlta.value.notas
    })
    ocupacionAlta.value = null
    await store.cargar()
    emit('actualizado')
  } catch (e) {
    errorAlta.value = e.message
  }
}

function filtrarResidentes() {
  const q = normalizar(busquedaResidente.value.trim())
  residenteSeleccionado.value = null
  if (!q) { residentesFiltrados.value = []; return }
  residentesFiltrados.value = residentesStore.residentes
    .filter(r => normalizar(`${r.nombre} ${r.apellidos} ${r.dni || ''}`).includes(q))
    .slice(0, 8)
}

function seleccionarResidente(r) {
  residenteSeleccionado.value = r
  busquedaResidente.value = `${r.apellidos}, ${r.nombre}`
  residentesFiltrados.value = []
}

async function asignar() {
  errorAsignar.value = ''
  if (!residenteSeleccionado.value) { errorAsignar.value = 'Selecciona un residente'; return }
  if (!fechaEntrada.value) { errorAsignar.value = 'Indica la fecha de entrada'; return }
  try {
    await window.api.asignarResidente(
      props.habitacion.id,
      residenteSeleccionado.value.id,
      fechaEntrada.value
    )
    busquedaResidente.value = ''
    residenteSeleccionado.value = null
    await store.cargar()
    emit('actualizado')
  } catch (e) {
    errorAsignar.value = e.message
  }
}

function hoy() {
  return new Date().toISOString().slice(0, 10)
}

function plantaLabel(p) {
  return { baja: 'Planta Baja', primera: 'Primera Planta', segunda: 'Segunda Planta' }[p] || p
}
</script>

<style scoped>
.seccion { margin-top: 20px; }
.seccion-titulo { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
.seccion-alta { background: #fff8f0; border: 1px solid #ffe0b2; border-radius: 6px; padding: 14px; }
.residente-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8f9fa; border-radius: 6px; margin-bottom: 8px; }
.residente-info { display: flex; flex-direction: column; gap: 2px; }
.detalle { font-size: 12px; color: #888; }
.lista-residentes { max-height: 160px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; margin-top: 4px; }
.residente-opcion { display: flex; align-items: center; gap: 8px; padding: 8px 12px; cursor: pointer; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
.residente-opcion:hover { background: #f0f7ff; }
.residente-opcion--seleccionado { background: #e3f2fd; }
</style>

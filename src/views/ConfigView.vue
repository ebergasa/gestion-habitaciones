<template>
  <div class="page">
    <h1 style="font-size:20px; font-weight:600; margin-bottom:20px;">Configuración</h1>

    <div style="max-width:700px; display:flex; flex-direction:column; gap:24px;">

      <!-- ── Identidad de la residencia ───────────────────────────────────── -->
      <section class="config-section">
        <h2 class="config-section-title">Identidad de la residencia</h2>

        <div class="form-group" style="max-width:400px;">
          <label>Nombre de la residencia</label>
          <div style="display:flex; gap:8px;">
            <input type="text" v-model="nombreEdit" @keyup.enter="guardarNombre" placeholder="Ej: Residencia San Agustín" />
            <button class="btn btn-primary btn-sm" @click="guardarNombre">Guardar</button>
          </div>
          <div v-if="nombreGuardado" class="alert alert-success" style="margin-top:8px; padding:6px 10px;">Nombre guardado.</div>
        </div>

        <div style="margin-top:16px;">
          <label style="display:block; font-size:13px; font-weight:500; color:#555; margin-bottom:8px;">Logotipo</label>

          <div class="logo-preview-area" :class="{ 'logo-preview-area--vacio': !cfg.logo }">
            <img v-if="cfg.logo" :src="cfg.logo" class="logo-preview-img" alt="Logo actual" />
            <span v-else style="color:#aaa; font-size:13px;">Sin logotipo</span>
          </div>

          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-outline btn-sm" @click="seleccionarLogo">
              {{ cfg.logo ? 'Cambiar logotipo' : 'Seleccionar logotipo' }}
            </button>
            <button v-if="cfg.logo" class="btn btn-danger btn-sm" @click="eliminarLogo">
              Quitar logotipo
            </button>
          </div>
          <p style="font-size:11px; color:#888; margin-top:6px;">
            Formatos admitidos: SVG, PNG, JPG. Se mostrará en la barra lateral y en el encabezado del plano impreso.
          </p>
        </div>
      </section>

      <!-- ── Configuración de habitaciones ────────────────────────────────── -->
      <section class="config-section">
        <h2 class="config-section-title">Habitaciones</h2>
        <p style="font-size:12px; color:#888; margin-bottom:14px;">
          Define qué habitaciones son dobles (2 plazas). El resto se consideran individuales (1 plaza).
          Esta configuración no suele cambiar.
        </p>

        <!-- Filtros -->
        <div style="display:flex; gap:12px; margin-bottom:12px; flex-wrap:wrap; align-items:flex-end;">
          <div class="form-group" style="margin:0; min-width:150px;">
            <label>Planta</label>
            <select v-model="filtroPlanta">
              <option value="">Todas</option>
              <option value="baja">Planta Baja</option>
              <option value="primera">Primera Planta</option>
              <option value="segunda">Segunda Planta</option>
            </select>
          </div>
          <div class="form-group" style="margin:0; min-width:150px;">
            <label>Tipo</label>
            <select v-model="filtroTipo">
              <option value="">Todos</option>
              <option value="individual">Individual</option>
              <option value="doble">Doble</option>
            </select>
          </div>
          <div style="font-size:12px; color:#888; padding-bottom:4px;">
            {{ habitacionesFiltradas.length }} habitación(es)
            · {{ habitacionesDobles.length }} doble(s)
          </div>
        </div>

        <div class="table-wrap" style="background:white; border-radius:8px; border:1px solid var(--color-border); max-height:400px; overflow-y:auto;">
          <table>
            <thead>
              <tr>
                <th style="width:100px;">Habitación</th>
                <th>Planta</th>
                <th>Tipo actual</th>
                <th style="width:200px;">Cambiar tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!habitacionesFiltradas.length">
                <td colspan="4" style="text-align:center; padding:24px; color:#999;">Sin resultados</td>
              </tr>
              <tr v-for="h in habitacionesFiltradas" :key="h.id">
                <td><strong>{{ h.numero }}</strong></td>
                <td>{{ plantaLabel(h.planta) }}</td>
                <td>
                  <span class="badge" :class="h.tipo === 'doble' ? 'badge-info' : ''">
                    {{ h.tipo === 'doble' ? 'Doble (2 plazas)' : 'Individual (1 plaza)' }}
                  </span>
                </td>
                <td>
                  <select
                    :value="h.tipo"
                    @change="cambiarTipo(h, $event.target.value)"
                    style="padding:4px 8px; border:1px solid var(--color-border); border-radius:4px; font-size:12px;"
                  >
                    <option value="individual">Individual</option>
                    <option value="doble">Doble</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ── Motivos de salida ─────────────────────────────────────────────── -->
      <section class="config-section">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <h2 class="config-section-title" style="margin:0;">Motivos de salida</h2>
          <button class="btn btn-primary btn-sm" @click="abrirFormulario(null)">+ Nuevo motivo</button>
        </div>
        <p style="font-size:12px; color:#888; margin-bottom:12px;">
          Código numérico único + nombre descriptivo. El código no se puede cambiar una vez creado.
        </p>

        <div class="table-wrap" style="background:white; border-radius:8px; border:1px solid var(--color-border);">
          <table>
            <thead>
              <tr>
                <th style="width:80px;">Código</th>
                <th>Nombre</th>
                <th style="width:140px;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!motivos.length">
                <td colspan="3" style="text-align:center; padding:24px; color:#999;">Sin motivos registrados</td>
              </tr>
              <tr v-for="m in motivos" :key="m.id">
                <td><code>{{ m.id }}</code></td>
                <td>{{ m.nombre }}</td>
                <td style="white-space:nowrap;">
                  <button class="btn btn-sm btn-outline" @click="abrirFormulario(m)">Editar</button>
                  <button class="btn btn-sm btn-danger" style="margin-left:6px;" @click="eliminar(m)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>

    <!-- Modal motivo -->
    <div class="modal-overlay" v-if="mostrarForm" @click.self="mostrarForm = false">
      <div class="modal" style="max-width:400px;">
        <div class="modal-header">
          <h2>{{ editando ? 'Editar motivo' : 'Nuevo motivo de salida' }}</h2>
          <button class="close-btn" @click="mostrarForm = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-error">{{ error }}</div>
          <div class="form-group">
            <label>Código numérico *</label>
            <input type="number" v-model.number="form.id" :disabled="!!editando" min="1" placeholder="Ej: 1" />
            <small style="color:#888; font-size:11px;">El código no se puede cambiar una vez creado.</small>
          </div>
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" v-model="form.nombre" placeholder="Ej: Fallecimiento, Traslado…" />
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
import { ref, computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config.js'
import { useHabitacionesStore } from '@/stores/habitaciones.js'

const cfg = useConfigStore()
const habStore = useHabitacionesStore()

// ── Nombre de la residencia ───────────────────────────────────────────────────
const nombreEdit = ref(cfg.nombreResidencia)
const nombreGuardado = ref(false)

onMounted(() => {
  nombreEdit.value = cfg.nombreResidencia
  habStore.cargar()
  cargarMotivos()
})

async function guardarNombre() {
  if (!nombreEdit.value.trim()) return
  await cfg.guardarNombre(nombreEdit.value.trim())
  nombreGuardado.value = true
  setTimeout(() => { nombreGuardado.value = false }, 2000)
}

async function seleccionarLogo() {
  await cfg.seleccionarLogo()
}

async function eliminarLogo() {
  if (!confirm('¿Quitar el logotipo?')) return
  await cfg.eliminarLogo()
}

// ── Habitaciones ─────────────────────────────────────────────────────────────
const filtroPlanta = ref('')
const filtroTipo = ref('')

const habitacionesFiltradas = computed(() => {
  return habStore.habitaciones.filter(h => {
    if (filtroPlanta.value && h.planta !== filtroPlanta.value) return false
    if (filtroTipo.value && h.tipo !== filtroTipo.value) return false
    return true
  })
})

const habitacionesDobles = computed(() =>
  habStore.habitaciones.filter(h => h.tipo === 'doble')
)

async function cambiarTipo(h, nuevoTipo) {
  const capacidad = nuevoTipo === 'doble' ? 2 : 1
  await window.api.updateHabitacion(h.id, { tipo: nuevoTipo, capacidad })
  await habStore.cargar()
}

function plantaLabel(p) {
  return { baja: 'Planta Baja', primera: 'Primera Planta', segunda: 'Segunda Planta' }[p] || p
}

// ── Motivos de salida ─────────────────────────────────────────────────────────
const motivos = ref([])
const mostrarForm = ref(false)
const editando = ref(null)
const error = ref('')
const form = ref({ id: '', nombre: '' })

async function cargarMotivos() {
  motivos.value = await window.api.getMotivosAlta()
}

function abrirFormulario(m) {
  editando.value = m
  error.value = ''
  form.value = m ? { id: m.id, nombre: m.nombre } : { id: '', nombre: '' }
  mostrarForm.value = true
}

async function guardar() {
  error.value = ''
  if (!form.value.id) { error.value = 'El código es obligatorio'; return }
  if (!form.value.nombre.trim()) { error.value = 'El nombre es obligatorio'; return }
  try {
    if (editando.value) {
      await window.api.updateMotivoAlta(editando.value.id, { nombre: form.value.nombre })
    } else {
      await window.api.createMotivoAlta({ id: form.value.id, nombre: form.value.nombre })
    }
    mostrarForm.value = false
    await cargarMotivos()
  } catch (e) {
    error.value = e.message
  }
}

async function eliminar(m) {
  if (!confirm(`¿Eliminar el motivo "${m.nombre}"?`)) return
  try {
    await window.api.deleteMotivoAlta(m.id)
    await cargarMotivos()
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.config-section {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.config-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.logo-preview-area {
  width: 240px;
  height: 80px;
  border: 2px dashed var(--color-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  padding: 8px;
}

.logo-preview-area--vacio {
  border-style: dashed;
}

.logo-preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>

<template>
  <div class="page">
    <h1 style="font-size:20px; font-weight:600; margin-bottom:20px;">Análisis e Histórico</h1>

    <div v-if="cargando" class="alert alert-info">Cargando datos…</div>

    <template v-else-if="datos">
      <!-- Métricas principales -->
      <div class="stats-bar" style="margin-bottom:24px;">
        <div class="stat-card stat-card--destacado">
          <div class="stat-value" style="font-size:40px; color:#3498db;">{{ pctOcupacion }}%</div>
          <div class="stat-label">Ocupación global</div>
          <div style="font-size:11px; color:#aaa; margin-top:4px;">{{ datos.plazasOcupadas }}/{{ datos.totalPlazas }} plazas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ datos.estanciaMedia }}d</div>
          <div class="stat-label">Estancia media actual</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ datos.estanciaMediaHistorica }}d</div>
          <div class="stat-label">Estancia media histórica</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ datos.altasMes }}</div>
          <div class="stat-label">Salidas este mes</div>
        </div>
      </div>

      <!-- Gráficos — fila 1 -->
      <div class="graficos-grid">
        <!-- Ocupación actual (donut) -->
        <div class="grafico-card grafico-card--grande">
          <h3 class="grafico-titulo">Ocupación actual</h3>
          <Doughnut :data="datosOcupacionActual" :options="optsDonut" />
        </div>

        <!-- Ocupación por planta (barras horizontales) -->
        <div class="grafico-card">
          <h3 class="grafico-titulo">Ocupación por planta</h3>
          <Bar :data="datosPorPlanta" :options="optsBarHoriz" />
        </div>

        <!-- Motivos de salida (donut) -->
        <div class="grafico-card">
          <h3 class="grafico-titulo">Motivos de salida</h3>
          <Doughnut
            v-if="datos.motivosSalida.length"
            :data="datosMotivos"
            :options="optsDonut"
          />
          <div v-else style="text-align:center;color:#aaa;padding:40px 0;">Sin datos</div>
        </div>
      </div>

      <!-- Gráficos — fila 2 -->
      <div class="graficos-grid graficos-grid--full">
        <!-- Evolución ocupación (línea) -->
        <div class="grafico-card">
          <h3 class="grafico-titulo">Evolución de ocupación (últimos 12 meses)</h3>
          <Line :data="datosEvolucion" :options="optsLine" />
        </div>

        <!-- Entradas y salidas (barras agrupadas) -->
        <div class="grafico-card">
          <h3 class="grafico-titulo">Entradas y salidas por mes</h3>
          <Bar :data="datosEntradasSalidas" :options="optsBarAgrupado" />
        </div>
      </div>

      <!-- Distribución de estancias -->
      <div class="graficos-grid graficos-grid--medio">
        <div class="grafico-card">
          <h3 class="grafico-titulo">Distribución de estancias (finalizadas)</h3>
          <Bar :data="datosDistribucion" :options="optsBarSimple" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Title)

const datos = ref(null)
const cargando = ref(true)

onMounted(async () => {
  datos.value = await window.api.getInsights()
  cargando.value = false
})

const PALETA = ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e']

const pctOcupacion = computed(() => {
  if (!datos.value?.totalPlazas) return 0
  return Math.round((datos.value.plazasOcupadas / datos.value.totalPlazas) * 100)
})

// ── Donut ocupación actual ────────────────────────────────────────────────────
const datosOcupacionActual = computed(() => ({
  labels: ['Ocupadas', 'Libres'],
  datasets: [{
    data: [datos.value?.plazasOcupadas || 0, datos.value?.plazasLibres || 0],
    backgroundColor: ['#EF5350', '#4CAF50'],
    borderWidth: 2
  }]
}))

// ── Barras por planta ─────────────────────────────────────────────────────────
const datosPorPlanta = computed(() => {
  const pp = datos.value?.porPlanta || []
  const labels = { baja: 'Planta Baja', primera: 'Primera Planta', segunda: 'Segunda Planta' }
  return {
    labels: pp.map(p => labels[p.planta] || p.planta),
    datasets: [{
      label: '% Ocupación',
      data: pp.map(p => p.total_plazas ? Math.round((p.plazas_ocupadas / p.total_plazas) * 100) : 0),
      backgroundColor: '#3498db'
    }]
  }
})

// ── Motivos ───────────────────────────────────────────────────────────────────
const datosMotivos = computed(() => ({
  labels: (datos.value?.motivosSalida || []).map(m => m.nombre),
  datasets: [{
    data: (datos.value?.motivosSalida || []).map(m => m.total),
    backgroundColor: PALETA
  }]
}))

// ── Evolución de ocupación (línea) ────────────────────────────────────────────
const datosEvolucion = computed(() => {
  const ev = datos.value?.evolucion || []
  return {
    labels: ev.map(e => e.mes),
    datasets: [{
      label: 'Residentes',
      data: ev.map(e => e.ocupados),
      borderColor: '#3498db',
      backgroundColor: 'rgba(52,152,219,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 4
    }]
  }
})

// ── Entradas y salidas agrupadas ──────────────────────────────────────────────
const datosEntradasSalidas = computed(() => {
  const meses = new Set([
    ...(datos.value?.entradas || []).map(e => e.mes),
    ...(datos.value?.salidas || []).map(s => s.mes)
  ])
  const labels = [...meses].sort()
  const mapEnt = Object.fromEntries((datos.value?.entradas || []).map(e => [e.mes, e.n]))
  const mapSal = Object.fromEntries((datos.value?.salidas || []).map(s => [s.mes, s.n]))
  return {
    labels,
    datasets: [
      { label: 'Entradas', data: labels.map(m => mapEnt[m] || 0), backgroundColor: '#2ecc71' },
      { label: 'Salidas', data: labels.map(m => mapSal[m] || 0), backgroundColor: '#e74c3c' }
    ]
  }
})

// ── Distribución de estancias ─────────────────────────────────────────────────
const datosDistribucion = computed(() => {
  const d = datos.value?.distribucionEstancias || {}
  return {
    labels: ['< 30 días', '1–6 meses', '6–12 meses', '> 1 año'],
    datasets: [{
      label: 'Estancias',
      data: [d.menos_30 || 0, d.uno_seis_meses || 0, d.seis_doce_meses || 0, d.mas_anio || 0],
      backgroundColor: PALETA
    }]
  }
})

// ── Opciones de gráficos ──────────────────────────────────────────────────────
const optsDonut = {
  responsive: true,
  plugins: { legend: { position: 'bottom' } }
}

const optsLine = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
}

const optsBarHoriz = {
  indexAxis: 'y',
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { x: { max: 100, ticks: { callback: v => v + '%' } } }
}

const optsBarAgrupado = {
  responsive: true,
  plugins: { legend: { position: 'top' } }
}

const optsBarSimple = {
  responsive: true,
  plugins: { legend: { display: false } }
}
</script>

<style scoped>
.graficos-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.graficos-grid--full {
  grid-template-columns: 1fr 1fr;
}

.graficos-grid--medio {
  grid-template-columns: 1fr 1fr;
}

.grafico-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
}

.grafico-card--grande {
  /* En la primera fila el donut puede ocupar más */
}

.grafico-titulo {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card--destacado {
  border: 2px solid var(--color-primary);
}
</style>

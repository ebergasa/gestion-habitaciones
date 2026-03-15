<template>
  <svg :viewBox="viewBox" class="plano-svg" xmlns="http://www.w3.org/2000/svg">

    <!-- Zonas comunes (decorativas) -->
    <g v-for="(z, i) in (zones || [])" :key="'z-' + i">
      <rect
        :x="z.x" :y="z.y" :width="z.w" :height="z.h"
        fill="#f0f4f8" stroke="#c8d0da" stroke-width="1" rx="3"
      />
      <text text-anchor="middle" font-size="10" fill="#7b8ea0" font-weight="500">
        <tspan
          v-for="(line, li) in z.text.split('\n')" :key="li"
          :x="z.x + z.w / 2"
          :y="z.y + z.h / 2 + (li - (z.text.split('\n').length - 1) / 2) * 13"
        >{{ line }}</tspan>
      </text>
    </g>

    <!-- Paredes -->
    <rect
      v-for="(w, i) in walls" :key="'wall-' + i"
      :x="w.x" :y="w.y" :width="w.w" :height="w.h"
      :fill="w.fill || 'none'" :stroke="w.stroke || '#999'" :stroke-width="w.strokeWidth || 1"
    />

    <!-- Habitaciones -->
    <g
      v-for="room in rooms" :key="room.numero"
      class="habitacion-rect"
      @click="$emit('clickHabitacion', room.numero)"
    >
      <rect
        :x="room.x" :y="room.y" :width="room.w" :height="room.h"
        :fill="colorDeHabitacion(room.numero)"
        :stroke="strokeDeHabitacion(room.numero)"
        stroke-width="1.5" rx="3"
      />

      <!-- Número: ocupa el tercio superior si hay residente, centrado si está libre -->
      <text
        :x="room.x + room.w / 2"
        :y="room.y + (lineasResidente(room.numero).length ? room.h * 0.3 : room.h * 0.5)"
        text-anchor="middle" dominant-baseline="middle"
        :fill="textoColor(room.numero)"
        :font-size="numFontSize(room)"
        font-weight="bold"
      >{{ room.numero }}</text>

      <!-- Nombre del/los residente(s): una línea por residente -->
      <text
        v-for="(linea, i) in lineasResidente(room.numero)"
        :key="'n' + i"
        :x="room.x + room.w / 2"
        :y="room.y + room.h * 0.58 + i * room.h * 0.23"
        text-anchor="middle" dominant-baseline="middle"
        :fill="textoColor(room.numero)"
        :font-size="nombreFontSize(room)"
        :textLength="room.w - 8"
        lengthAdjust="spacingAndGlyphs"
      >{{ linea }}</text>
    </g>

    <!-- Labels -->
    <text
      v-for="(lbl, i) in labels" :key="'lbl-' + i"
      :x="lbl.x" :y="lbl.y"
      text-anchor="middle"
      :font-size="lbl.fontSize || 12"
      :font-weight="lbl.fontWeight || 'normal'"
      :fill="lbl.color || '#555'"
    >{{ lbl.text }}</text>
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import { useHabitacionesStore } from '@/stores/habitaciones'

const props = defineProps({ rooms: Array, labels: Array, walls: Array, viewBox: String, zones: Array })
defineEmits(['clickHabitacion'])

const store = useHabitacionesStore()

const mapaHabitaciones = computed(() => {
  const m = {}
  for (const h of store.habitaciones) m[h.numero] = h
  return m
})

function colorDeHabitacion(numero) {
  const h = mapaHabitaciones.value[numero]
  if (!h) return '#9E9E9E'
  return store.colorHabitacion(h)
}

function strokeDeHabitacion(numero) {
  return colorDeHabitacion(numero) === '#FFFFFF' ? '#bbb' : 'white'
}

function textoColor(numero) {
  return colorDeHabitacion(numero) === '#FFFFFF' ? '#222' : 'white'
}

// Líneas de texto para los residentes: "Apellidos Nombre"
function lineasResidente(numero) {
  const h = mapaHabitaciones.value[numero]
  if (!h || !h.ocupaciones.length) return []
  return h.ocupaciones.map(o => {
    const ap = o.apellidos || ''
    const nb = o.nombre || ''
    return `${ap} ${nb}`.trim()
  })
}

function numFontSize(room) {
  const base = Math.min(room.w, room.h)
  return Math.max(9, base * 0.26)
}

function nombreFontSize(room) {
  const base = Math.min(room.w, room.h)
  return Math.max(7, base * 0.19)
}
</script>

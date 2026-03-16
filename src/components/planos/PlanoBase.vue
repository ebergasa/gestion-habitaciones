<template>
  <svg :viewBox="viewBox" class="plano-svg" xmlns="http://www.w3.org/2000/svg"
    font-family="'Inter', 'Segoe UI', system-ui, sans-serif"
    text-rendering="optimizeLegibility">

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
      <!-- OCUPADA: fondo blanco + banda de color solo en la zona del número -->
      <template v-if="lineasResidente(room.numero).length">
        <clipPath :id="`clip-${room.numero}`">
          <rect :x="room.x" :y="room.y" :width="room.w" :height="room.h" rx="3" />
        </clipPath>

        <!-- Fondo blanco del recuadro completo -->
        <rect
          :x="room.x" :y="room.y" :width="room.w" :height="room.h"
          fill="white" :stroke="strokeDeHabitacion(room.numero)"
          stroke-width="1.5" rx="3"
        />

        <!-- Banda de color solo arriba (respeta las esquinas redondeadas) -->
        <rect
          :clip-path="`url(#clip-${room.numero})`"
          :x="room.x" :y="room.y"
          :width="room.w" :height="headerH(room)"
          :fill="colorBanda(room.numero)"
        />

        <!-- Línea separadora fina -->
        <line
          :x1="room.x + 1" :y1="room.y + headerH(room)"
          :x2="room.x + room.w - 1" :y2="room.y + headerH(room)"
          stroke="#ccc" stroke-width="0.8"
        />

        <!-- Número en la banda -->
        <text
          :x="room.x + room.w / 2"
          :y="room.y + headerH(room) / 2"
          text-anchor="middle" dominant-baseline="middle"
          :fill="textoColorBanda(room.numero)"
          :font-size="numFontSize(room)"
          :font-weight="fontWeightBanda(room.numero)"
          font-variant-numeric="tabular-nums"
        >{{ room.numero }}</text>

        <!-- Nombre(s) del/los residente(s) -->
        <text
          v-for="(linea, i) in lineasResidente(room.numero)"
          :key="'n' + i"
          :x="room.x + room.w / 2"
          :y="residenteY(room, i)"
          text-anchor="middle" dominant-baseline="middle"
          fill="#222"
          :font-size="nombreFontSize(room)"
          :textLength="room.w - 8"
          lengthAdjust="spacingAndGlyphs"
        >{{ linea }}</text>
      </template>

      <!-- LIBRE: recuadro completamente coloreado, número centrado -->
      <template v-else>
        <rect
          :x="room.x" :y="room.y" :width="room.w" :height="room.h"
          :fill="colorDeHabitacion(room.numero)"
          :stroke="strokeDeHabitacion(room.numero)"
          stroke-width="1.5" rx="3"
        />
        <text
          :x="room.x + room.w / 2"
          :y="room.y + room.h / 2"
          text-anchor="middle" dominant-baseline="middle"
          :fill="textoColor(room.numero)"
          :font-size="numFontSize(room)"
          font-weight="bold"
          font-variant-numeric="tabular-nums"
        >{{ room.numero }}</text>
      </template>
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
  // Habitaciones ocupadas siempre con marco visible
  if (lineasResidente(numero).length) return '#bbb'
  return colorDeHabitacion(numero) === '#FFFFFF' ? '#bbb' : 'white'
}

function textoColor(numero) {
  return colorDeHabitacion(numero) === '#FFFFFF' ? '#222' : 'white'
}

// Banda de color para la zona del número en habitaciones ocupadas.
// Llena (#FFFFFF) → gris claro para que se distinga del fondo blanco.
function colorBanda(numero) {
  const c = colorDeHabitacion(numero)
  return c === '#FFFFFF' ? '#e0e0e0' : c
}

function textoColorBanda(numero) {
  return colorDeHabitacion(numero) === '#FFFFFF' ? '#333' : 'white'
}

// Banda gris (llena): peso menor para que el número no parezca más grande que en naranja
function fontWeightBanda(numero) {
  return colorDeHabitacion(numero) === '#FFFFFF' ? '500' : 'bold'
}

// Altura de la banda del número (proporcional al tamaño de fuente)
function headerH(room) {
  return Math.max(12, numFontSize(room) * 1.5)
}

// Y centrada de cada residente en la zona inferior
function residenteY(room, i) {
  const n = lineasResidente(room.numero).length
  const areaTop = room.y + headerH(room)
  const areaH   = room.h - headerH(room)
  return areaTop + areaH * ((i + 1) / (n + 1))
}

// Líneas de texto para los residentes: "Apellidos Nombre"
function lineasResidente(numero) {
  const h = mapaHabitaciones.value[numero]
  if (!h || !h.ocupaciones.length) return []
  return h.ocupaciones.map(o => {
    const nb = o.nombre || ''
    const ap = o.apellidos || ''
    return `${nb} ${ap}`.trim()
  })
}

function numFontSize(room) {
  const base = Math.min(room.w, room.h)
  const size = lineasResidente(room.numero).length ? base * 0.20 : base * 0.26
  return Math.max(8, size)
}

function nombreFontSize(room) {
  const base = Math.min(room.w, room.h)
  return Math.min(11, Math.max(8, base * 0.19))
}
</script>

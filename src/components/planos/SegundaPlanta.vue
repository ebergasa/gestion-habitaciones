<template>
  <PlanoBase v-bind="planoData" @clickHabitacion="$emit('clickHabitacion', $event)" />
</template>

<script setup>
import PlanoBase from './PlanoBase.vue'
import { rooms, labels, walls, viewBox } from '@/data/plano-segunda.js'

defineEmits(['clickHabitacion'])

const planoData = { rooms, labels, walls, viewBox }
</script>

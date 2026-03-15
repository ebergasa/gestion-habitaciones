<template>
  <PlanoBase v-bind="planoData" @clickHabitacion="$emit('clickHabitacion', $event)" />
</template>

<script setup>
import PlanoBase from './PlanoBase.vue'
import { rooms, labels, walls, viewBox, zones } from '@/data/plano-primera.js'

defineEmits(['clickHabitacion'])

const planoData = { rooms, labels, walls, viewBox, zones }
</script>

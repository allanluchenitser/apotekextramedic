<script setup lang="ts">
import { Vector3 } from 'three';
import { toFixed } from '@/js/util';

defineProps<{ position: Vector3 }>()
</script>

<template>
<div class="
  displayCoordinates
  absolute bottom-0 left-1/2 transform -translate-x-1/2
  p-2
  bg-white border
  border-gray-300
">
  X: {{ toFixed(position.x, 2) }}, Y: {{ toFixed(position.y, 2) }}, Z: {{ toFixed(position.z, 2) }}
</div>
</template>

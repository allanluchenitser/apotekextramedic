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
  bg-white
  flex
  gap-3
">
    <span>{{ toFixed(position.x, 2) }}</span>
    <span>{{ toFixed(position.y, 2) }}</span>
    <span>{{ toFixed(position.z, 2) }}</span>
</div>
</template>

<script setup lang="ts">
import type { Vector3 } from 'three';
import type { RotationDegrees } from '@/js/localTypes';

defineProps<{
  position: {
    position: Vector3,
    rotation: RotationDegrees,
    lookAt: Vector3
  },
}>()
</script>

<template>
<div
  class="
    displayCoordinates
    absolute bottom-0 left-1/2 transform -translate-x-1/2
    p-2
    bg-white
    flex
    gap-3
    justify-center
    font-mono
    text-sm
  "
>
  <div v-if="position?.position" class="flex gap-3">
    <span>{{ position.position.x.toFixed(2) }}</span>
    <span>{{ position.position.y.toFixed(2) }}</span>
    <span>{{ position.position.z.toFixed(2) }}</span>
  </div>
  <span>࿔</span>
  <div v-if="position?.rotation" class="flex gap-3">
    <span>{{ position.rotation.x.toFixed(2) }}</span>
    <span>{{ position.rotation.y.toFixed(2) }}</span>
    <span>{{ position.rotation.z.toFixed(2) }}</span>
  </div>
  <span>➛</span>
  <div v-if="position?.lookAt" class="flex gap-3">
    <span>{{ position.lookAt.x.toFixed(2) }}</span>
    <span>{{ position.lookAt.y.toFixed(2) }}</span>
    <span>{{ position.lookAt.z.toFixed(2) }}</span>
  </div>
</div>
</template>

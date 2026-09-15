<script setup lang="ts">
import type { Vector3 } from 'three';
import { toFixed } from '@/js/util';

defineProps<{
  position: { position: Vector3, euler: Vector3 },
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
  "
>
    <span>{{ toFixed(position.position.x, 2) }}</span>
    <span>{{ toFixed(position.position.y, 2) }}</span>
    <span>{{ toFixed(position.position.z, 2) }}</span>
    <span>➛</span>
    <span>{{ toFixed(position.euler.x, 2) }}</span>
    <span>{{ toFixed(position.euler.y, 2) }}</span>
    <span>{{ toFixed(position.euler.z, 2) }}</span>
</div>
</template>

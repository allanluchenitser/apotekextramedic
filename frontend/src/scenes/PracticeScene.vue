<script setup lang="ts">
import type {
  TresObject,
} from '@tresjs/core'

import { toRainbow } from '@/js/util'

import { OrbitControls } from '@tresjs/cientos'

import { Vector3 } from 'three'
import { shallowRef, ref } from 'vue'

const props = withDefaults(defineProps<{
  numberOfTorus?: number
}>(), {
  numberOfTorus: 5
});

const cameraPosition = new Vector3(0, 0, 30);
const targetPosition = new Vector3(0, 0, 0);
const meshPosition = new Vector3(0, 2, 0);
const lightPosition = new Vector3(0, 2, 4);

</script>

<template>
  <TresPerspectiveCamera
    :position="cameraPosition"
    :look-at="targetPosition"
  />

  <TresAmbientLight
    :intensity="0.5"
    color="white"
  />

  <TresMesh
    v-for="(val, index) in props.numberOfTorus"
    :key="index"
    :position="meshPosition"
  >
    <TresTorusGeometry :args="[2 * val, .5, 10, 25, Math.PI]" />
    <TresMeshBasicMaterial :color="toRainbow(index, props.numberOfTorus)" />
  </TresMesh>

  <TresDirectionalLight
    :position="lightPosition"
    :intensity="1"
    cast-shadow
  />

  <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" />
  <OrbitControls
    :enableDamping="false"
  />
</template>

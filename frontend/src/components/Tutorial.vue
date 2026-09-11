<script setup lang="ts">
import {
  type TresObject,
  useLoop,
} from '@tresjs/core'

import { toRainbow } from '@/js/util'

import { OrbitControls } from '@tresjs/cientos'

import { Vector3 } from 'three'
import { shallowRef } from 'vue'

const cameraPosition = new Vector3(0, 0, 30);
const targetPosition = new Vector3(0, 0, 0);
const meshPosition = new Vector3(0, 2, 0);
const lightPosition = new Vector3(0, 2, 4);

const NUMBER_OF_TORUSES = 5

// const { onBeforeRender } = useLoop()

const torusRefs = shallowRef<TresObject[]>([])

// onBeforeRender(({ elapsed }) => {
//   if (torusRefs.value.length > 0) {
//     torusRefs.value.forEach((torus) => {
//       // torus.rotation.y = elapsed
//       torus.rotation.z = elapsed
//     })
//   }
// })
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
    v-for="(val, index) in NUMBER_OF_TORUSES"
    ref="torusRefs"
    :key="index"
    :position="meshPosition"
  >
    <TresTorusGeometry :args="[2 * val, .5, 10, 25, Math.PI]" />
    <TresMeshBasicMaterial :color="toRainbow(index, NUMBER_OF_TORUSES)" />
  </TresMesh>

  <TresDirectionalLight
    :position="lightPosition"
    :intensity="1"
    cast-shadow
  />

  <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" />
  <OrbitControls />
</template>

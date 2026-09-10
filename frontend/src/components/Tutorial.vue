<script setup lang="ts">
import { type TresObject, useLoop } from '@tresjs/core'

import { OrbitControls } from '@tresjs/cientos'

import { Vector3 } from 'three'
import { shallowRef } from 'vue'

const cameraPosition = new Vector3(7, 7, 7);
const targetPosition = new Vector3(0, 0, 0);
const meshPosition = new Vector3(0, 2, 0);
const lightPosition = new Vector3(0, 2, 4);

const NUMBER_OF_TORUSES = 5

// const { onBeforeRender } = useLoop()

const torusRefs = shallowRef<TresObject[]>([])

// onBeforeRender(({ elapsed }) => {
//   if (torusRef.value.length > 0) {
//     torusRef.value.forEach(torus => {
//       torus.rotation.y = elapsed
//       // torus.rotation.z = elapsed
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
    v-for="
      (val, index) in Array.from({ length: NUMBER_OF_TORUSES }, (_, i) => i)
    "
    :ref="torusRefs"
    :key="index"
    :position="meshPosition"
  >
    <TresTorusGeometry :args="[2 * val, .1 * val, 10, 25]" />
    <TresMeshBasicMaterial color="yellow" />
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

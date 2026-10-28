<script setup lang="ts">
import * as THREE from 'three'
const { Vector3 } = THREE
import { ref } from 'vue'
import { OrbitControls } from '@tresjs/cientos'

// --- Initial camera and light setup ---

const initialCameraPosition = new Vector3(0, 0, 5)
const initialCameraLookAt = new Vector3(0, 0, 0)
const pointLightPosition = new Vector3(2, 2, 2)

const pointLightRef = ref(null)

// --- Initial shape locations ---
const initialSpherePosition = new Vector3(0, 0, 0)

</script>

<template>
   <TresPerspectiveCamera
      :fov="75"
      :near="0.1"
      :far="1000"
      :position="initialCameraPosition"
      :look-at="initialCameraLookAt"
    />

    <TresMesh :position="initialSpherePosition">
      <TresSphereGeometry :args="[1, 32, 32]" />
      <TresMeshStandardMaterial color="yellow" />
    </TresMesh>

    <TresPointLight
      ref="pointLightRef"
      :color="'white'"
      :intensity="2"
      :position="pointLightPosition"
    />

    <TresPointLightHelper
      v-if="pointLightRef"
      :args="[pointLightRef]"
    />

    <OrbitControls />
</template>


<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed, watchEffect } from 'vue'

import {
  Vector3,
  Mesh,
  Camera,
  type PointLight,
  type DirectionalLight,
  type PointLightHelper,
  type DirectionalLightHelper
} from 'three'

import { useLoop, useTresContext } from '@tresjs/core'
import { useGLTF } from '@tresjs/cientos'

import {
  Physics,
  RigidBody,
} from '@tresjs/rapier'

import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

// import { toFixedNumber, tresObjectInfo } from '@/js/util'
import type { RotationDegrees } from '@/js/localTypes'

import WalkThroughController from '@/sharedComponents/WalkthroughController.vue'

// ------ SETUP ------

// const emit = defineEmits<{
//   position: [{
//     position: Vector3,
//     rotation: RotationDegrees,
//     lookAt: Vector3 | null
//   } | undefined]
// }>();

const {
  state: apotekState,
  isLoading
} = useGLTF(apotekGlbUrl);

const initialCustomerPosition = new Vector3(10.51,
0,
15.16
)

const directionalLightPosition = new Vector3(0, 8, 20);
const directionalLightLookAt = new Vector3(0, 8, 0);

// ------ REFS ------

const orbitControlsRef = ref<any>(null)

// ------ LIFECYCLE ------

onMounted(async () => {
  await nextTick();
  orbitControlsRef.value?.instance.update();

  const worldPosition = new Vector3()
  apotekState.value?.scene.getWorldPosition(worldPosition)
})
</script>

<template>
  <Suspense>
    <Physics debug>
      <!-- ------ CAMERA ------ -->
      <WalkThroughController
        :initialPosition="initialCustomerPosition"
      />

      <!-- ------ LOAD GLB ------ -->

      <!-- <primitive
        v-for="mesh in interactiveMeshes"
        :key="mesh.uuid"
        :object="mesh"
      /> -->

      <primitive
        v-if="!isLoading"
        :object="apotekState?.scene"
      />

      <!-- ------ LIGHTS ------ -->

      <TresAmbientLight
        :intensity=".5"
        color="white"
      />

      <TresDirectionalLight
        :position="directionalLightPosition"
        :lookAt="directionalLightLookAt"
        :intensity="3"
      />

      <!-- ------ HELPERS ------ -->

      <!-- <TresAxesHelper />
      <TresGridHelper :args="[10, 10]" /> -->
    </Physics>
  </Suspense>
</template>

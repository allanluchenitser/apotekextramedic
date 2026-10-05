<script setup lang="ts">
import * as THREE from 'three'
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

// import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'
import apotekGlbUrl from '@/assets/glb/apotek_colliders.glb?url'

// import { toFixedNumber, tresObjectInfo } from '@/js/util'
import type { RotationDegrees } from '@/js/localTypes'

import WalkThroughController from '@/sharedComponents/WalkthroughController.vue'

// ------ SETUP ------

const debugColliders = true

const {
  state: apotekState,
  isLoading
} = useGLTF(apotekGlbUrl);

const initialCustomerPosition = new Vector3(10.51, 0, 15.16)
const directionalLightPosition = new Vector3(0, 8, 20);
const directionalLightLookAt = new Vector3(0, 8, 0);

// ------ REFS ------


// ------ WATCHES, LIFECYCLE ------

watch(
  () => apotekState.value?.scene,
  (scene) => {
    if (!scene) return

    scene.traverse((obj) => {
      // console.log('traversing object:', obj.name)

      // Inspect objects here
      if (obj instanceof THREE.Mesh && obj.name === 'floor_outside_pre-lot') {
        console.log('found floor_outside_pre-lot')
        const box = new THREE.Box3().setFromObject(obj)
        const size = new THREE.Vector3()
        box.getSize(size)
        console.log(
          'floor outside pre-lot size:',
          size.toArray()
        )
      }

      // Visualize colliders, debug
      if (obj.name.startsWith('COL_')) {
        obj.visible = debugColliders

        if (debugColliders && obj instanceof THREE.Mesh) {
          obj.material = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            wireframe: true,
            depthTest: false,
            transparent: true,
            opacity: 0.7,
          })

          obj.renderOrder = 999
        }
      }

    })
  },
  { immediate: true }
)
</script>

<template>
  <Suspense>
    <Physics debug>
      <!-- ------ CAMERA ------ -->
      <WalkThroughController
        :initialPosition="initialCustomerPosition"
        :allowVerticalMovement="true"
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

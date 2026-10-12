<script setup lang="ts">
import * as THREE from 'three'

import {
  INITIAL_CUSTOMER_POSITION,
  INITIAL_CUSTOMER_LOOK_AT
} from '@/views/apotekview/apotekConfig'

import {
  nextTick,
  onMounted,
  ref,
  watch,
  computed,
  watchEffect,
  shallowRef
} from 'vue'

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

const debugColliders = false;
const colliderMeshes = shallowRef<THREE.Mesh[]>([])

const {
  state: apotekState,
  isLoading
} = useGLTF(apotekGlbUrl);

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

      // barf all names
      // console.log('name barf:', obj.name)

      // Inspect objects here

      if (obj.name.includes('wall')) {
        console.log('found wall:', obj.name)
        // const box = new THREE.Box3().setFromObject(obj)
        // const size = new THREE.Vector3()
        // box.getSize(size)
        // console.log(
        //   'wall size:',
        //   size.toArray()
        // )
      }

      // generate collider meshes array

      if (obj.name.startsWith('COL_')) {
        console.log('found collider:', obj.name)

        obj.visible = debugColliders

        if (obj instanceof THREE.Mesh) {
          colliderMeshes.value.push(obj)
        }

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
    <Physics>
      <!-- ------ CAMERA ------ -->
      <WalkThroughController
        :initialPosition="INITIAL_CUSTOMER_POSITION"
        :initialLookAt="INITIAL_CUSTOMER_LOOK_AT"
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

      <RigidBody
        v-for="colMesh in colliderMeshes"
        :key="colMesh.uuid"
        type="fixed"
        collider="trimesh"
      >
        <primitive :object="colMesh" />
      </RigidBody>

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

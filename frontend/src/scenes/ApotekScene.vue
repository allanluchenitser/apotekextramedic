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

const emit = defineEmits<{
  position: [{
    position: Vector3,
    rotation: RotationDegrees,
    lookAt: Vector3 | null
  } | undefined]
}>();

const {
  state: apotekState,
  isLoading
} = useGLTF(apotekGlbUrl);

const { renderer } = useTresContext();
const { onBeforeRender } = useLoop();

const initialCameraPosition = new Vector3(10.51,
1.19,
15.16
)

const directionalLightPosition = new Vector3(0, 8, 20);
const directionalLightLookAt = new Vector3(0, 8, 0);

// ------ REFS ------

const orbitControlsRef = ref<any>(null)

// ------ LIFECYCLE ------

// RAF loop
onBeforeRender(() => {
  // const camData = cameraPosRotLookat(camera.activeCamera.value)
  // emit('position', camData);

  console.log('render loop');
});

// post Render callback. Not the same as RAF loop
renderer.onRender(() => {
  console.count('ACTUAL RENDER')
})

onMounted(async () => {
  await nextTick();
  orbitControlsRef.value?.instance.update();

  const worldPosition = new Vector3()
  apotekState.value?.scene.getWorldPosition(worldPosition)
  // console.log('world position:', worldPosition.toArray().join(', '))
})

// function cameraPosRotLookat(camera: Camera, orbitControlsRef: any): {
//   position: Vector3;
//   rotation: RotationDegrees;
//   lookAt: Vector3;
// } | undefined {
//   const position = camera.position;
//   const rotation = camera.rotation;

//   if (!position) return;

//   const px = toFixedNumber(position.x, 2)
//   const py = toFixedNumber(position.y, 2)
//   const pz = toFixedNumber(position.z, 2)

//   const ex = toFixedNumber(180 * rotation.x / Math.PI, 2)
//   const ey = toFixedNumber(180 * rotation.y / Math.PI, 2)
//   const ez = toFixedNumber(180 * rotation.z / Math.PI, 2)

//   const pos = new Vector3(px, py, pz);
//   const rot: RotationDegrees = { x: ex, y: ey, z: ez };
//   const look = orbitControlsRef.value?.instance?.target;

//   return {
//     position: pos,
//     rotation: rot,
//     lookAt: look,
//   };
// }

// const interactiveMeshes = computed(() => {
//   const meshes = Object.values(apotekNodes.value).filter(
//     object => object instanceof Mesh
//   )

//   console.log(meshes.map(mesh => { return `${mesh.name}, ${mesh.parent?.name}` }))

//   return meshes
// })
</script>

<template>
  <Suspense>
    <Physics debug>
  <!-- ------ CAMERA ------ -->
  <!-- <TresPerspectiveCamera
    :position="initialCameraPosition"
  /> -->a

  <WalkThroughController :initialCameraPosition="initialCameraPosition" />


  <!-- ------ LOAD GLB ------ -->

  <!-- <primitive
    v-for="mesh in interactiveMeshes"
    :key="mesh.uuid"
    :object="mesh"
  /> -->

  <primitive v-if="!isLoading" :object="apotekState?.scene" />

  <!-- ------ LIGHTS ------ -->

  <TresAmbientLight
    :intensity=".5"
    color="white"
  />

  <TresDirectionalLight
    ref="directionLightRef"
    :position="directionalLightPosition"
    :lookAt="directionalLightLookAt"
    :intensity="3"
  />

  <!-- ------ HELPERS ------ -->

<!--   <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" /> -->

  <!-- <OrbitControls
    ref="orbitControlsRef"
    :enableDamping="false"
    :target="initialLookAtPosition"
  /> -->
    </Physics>
  </Suspense>
</template>

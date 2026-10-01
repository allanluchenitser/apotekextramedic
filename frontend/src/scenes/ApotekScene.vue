<script setup lang="ts">

import { nextTick, onMounted, ref, watch, computed, watchEffect } from 'vue'
import * as THREE from 'three'

import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

import { OrbitControls, useGLTF } from '@tresjs/cientos'
import { useLoop, useTresContext } from '@tresjs/core'

import {
  Vector3,
  Mesh,
  type PointLight,
  type DirectionalLight,
  type PointLightHelper,
  type DirectionalLightHelper
} from 'three'

import { toFixedNumber, tresObjectInfo } from '@/js/util'
import type { RotationDegrees } from '@/js/localTypes'

import { usePointLightGui } from '@/scenes/usePointLightGui'
import { useDirectionalLightGui } from '@/scenes/useDirectionalLightGui'

import { giveAllMeshesOwnMaterial } from '@/scenes/apotekHelpers'
import { useMeshDebugger } from '@/scenes/useMeshDebugger'
import GUI from 'lil-gui'

// ------ SETUP ------

const emit = defineEmits<{
  position: [{
    position: Vector3,
    rotation: RotationDegrees,
    lookAt: Vector3,
  }],
}>();

const {
  state: apotekState,
  isLoading
} = useGLTF(apotekGlbUrl);

const { camera, renderer } = useTresContext();


const { onBeforeRender } = useLoop();

const initialCameraPosition = new Vector3(10.51,
1.19,
15.16
)

const initialLookAtPosition = new Vector3(1.11,
2.94,
3.43)

const directionalLightPosition = new Vector3(0, 8, 20);
const directionalLightLookAt = new Vector3(0, 8, 0);

// ------ REFS ------

const controls = ref<any>(null)

const pointLightRef = ref<PointLight | null>(null)
const pointLightHelperRef = ref<PointLightHelper | null>(null)

const directionLightRef = ref<DirectionalLight | null>(null)
const directionLightHelperRef = ref<DirectionalLightHelper | null>(null)

// ------ WATCHERS ------

// useMeshDebugger(
//   () => apotekState.value?.scene,
//   {
//     enabled: import.meta.env.DEV,
//     boxColor: 0xffff00,
//     markerColor: 0xff3333,
//   },
// )

// watchEffect(() => {
//   console.log(
//     'mode:', renderer.mode,
//     'canBeInvalidated:', renderer.canBeInvalidated.value,
//     'loop active:', renderer.loop.isActive.value,
//   )
// })

// watch(isLoading, (loading) => {
//   if (loading || !apotekState.value?.scene) return;

//   const scene = apotekState.value.scene;

//   giveAllMeshesOwnMaterial(scene);

//   let lastParentName = '';

//   scene.traverse((obj) => {
//     if (obj instanceof THREE.Mesh) {
//       if (obj.parent?.name !== lastParentName) {
//         // console.log('---', obj.parent?.name, '---')
//         lastParentName = obj.parent?.name || '';
//       }
//       else {
//         // console.log(obj.name);
//       }
//       const materials = Array.isArray(obj.material)
//         ? obj.material
//         : [obj.material]

//       materials.forEach((material) => {
//         if ('normalMap' in material) {
//           material.normalMap = null
//           material.needsUpdate = true
//         }
//       })
//     }
//   })
// })

// ------ LIFECYCLE ------

// RAF loop
onBeforeRender(() => {
  const cam = camera.activeCamera.value;

  const position = cam.position;
  const rotation = cam.rotation;

  if (!position) return;

  const px = toFixedNumber(position.x, 2)
  const py = toFixedNumber(position.y, 2)
  const pz = toFixedNumber(position.z, 2)

  const ex = toFixedNumber(180 * rotation.x / Math.PI, 2)
  const ey = toFixedNumber(180 * rotation.y / Math.PI, 2)
  const ez = toFixedNumber(180 * rotation.z / Math.PI, 2)

  const pos = new Vector3(px, py, pz);
  const rot: RotationDegrees = { x: ex, y: ey, z: ez };
  const look = controls.value?.instance?.target;

  // console.log('look', look)

  emit('position', {
    position: pos,
    rotation: rot,
    lookAt: look,
  });

  console.log('render loop');
});

// post Render callback. Not the same as RAF loop
renderer.onRender(() => {
  console.count('ACTUAL RENDER')
})

onMounted(async () => {
  await nextTick();
  controls.value?.instance.update();

  const worldPosition = new Vector3()
  apotekState.value?.scene.getWorldPosition(worldPosition)
  // console.log('world position:', worldPosition.toArray().join(', '))
})


// const gui = new GUI()
// usePointLightGui(gui, pointLightRef, pointLightHelperRef)
// useDirectionalLightGui(gui, directionLightRef, directionLightHelperRef)

// const interactiveMeshes = computed(() => {
//   const meshes = Object.values(apotekNodes.value).filter(
//     object => object instanceof Mesh
//   )

//   console.log(meshes.map(mesh => { return `${mesh.name}, ${mesh.parent?.name}` }))

//   return meshes
// })
</script>

<template>
  <!-- ------ CAMERA ------ -->
  <TresPerspectiveCamera
    :position="initialCameraPosition"
  />


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

  <!-- <TresPointLight
    ref="pointLightRef"
    :position="new Vector3(5, 1, 10)"
    :intensity="100"
  />

  <TresPointLightHelper
    v-if="pointLightRef"
    ref="pointLightHelperRef"
    :args="[pointLightRef, 1, 0xff0000]"
  /> -->

  <TresDirectionalLight
    ref="directionLightRef"
    :position="directionalLightPosition"
    :lookAt="directionalLightLookAt"
    :intensity="3"
  />

  <!-- <TresDirectionalLightHelper
    v-if="directionLightRef"
    ref="directionLightHelperRef"
    :args="[directionLightRef, 1, 0x00ff00]"
  /> -->

  <!-- ------ HELPERS ------ -->

<!--   <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" /> -->

  <OrbitControls
    ref="controls"
    :enableDamping="false"
    :target="initialLookAtPosition"
  />
</template>

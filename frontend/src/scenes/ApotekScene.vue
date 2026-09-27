<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed } from 'vue'

import apotekGlbUrl from '@/assets/glb/apotek_tres.glb?url'

import { OrbitControls, useGLTF } from '@tresjs/cientos'
import { useLoop, useTresContext } from '@tresjs/core'

import { Vector3, Mesh, PointLight, DirectionalLight, PointLightHelper, DirectionalLightHelper } from 'three'

import { toFixedNumber, tresObjectInfo } from '@/js/util'
import type { RotationDegrees } from '@/js/localTypes'

import { usePointLightGui } from '@/scenes/usePointLightGui'
import { useDirectionalLightGui } from '@/scenes/useDirectionalLightGui'

import GUI from 'lil-gui'

// ------ REF ------

const controls = ref<any>(null)

const pointLightRef = ref<PointLight | null>(null)
const pointLightHelperRef = ref<PointLightHelper | null>(null)

  const directionLightRef = ref<DirectionalLight | null>(null)
    const directionLightHelperRef = ref<DirectionalLightHelper | null>(null)

// ------ SETUP ------

const emit = defineEmits<{
  position: [{ position: Vector3, rotation: RotationDegrees }],
}>();

const {
  state: apotekState,
  isLoading
} = useGLTF(apotekGlbUrl);

const { camera } = useTresContext();
const { onBeforeRender } = useLoop();

const initialCameraPosition = new Vector3(0, 8, 15.05);
const initialLookAtPosition = new Vector3(0, 0, 0);



// ------ WATCHERS ------

watch(isLoading, (loading) => {
  if (loading) return;

  apotekState.value?.scene.traverse((obj) => {
    // make each object have its own material
    if (obj instanceof Mesh) {
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((mat) => mat.clone())

        // console.log('material array:')
        // for (const mat of obj.material) {
        //   tresObjectInfo({ material: mat } as Mesh)
        // }
      }
      else {
        // obj.material = obj.material.clone()
        // tresObjectInfo(obj)
      }
    }
  })
})

// ------ LIFECYCLE ------

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

  emit('position', {
    position: pos,
    rotation: rot
  });
});

onMounted(async () => {
  await nextTick();
  controls.value?.instance.update();

  const worldPosition = new Vector3()
  apotekState.value?.scene.getWorldPosition(worldPosition)
  // console.log('world position:', worldPosition.toArray().join(', '))
})


const gui = new GUI()
usePointLightGui(gui, pointLightRef, pointLightHelperRef)
useDirectionalLightGui(gui, directionLightRef, directionLightHelperRef)

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
  <!--
  <primitive
    v-for="mesh in interactiveMeshes"
    :key="mesh.uuid"
    :object="mesh"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  />  -->

  <primitive v-if="!isLoading" :object="apotekState?.scene" />

  <!-- ------ LIGHTS ------ -->

  <TresAmbientLight
    :intensity=".1"
    color="white"
  />

  <TresPointLight
    ref="pointLightRef"
    :position="new Vector3(5, 1, 10)"
    :intensity="100"
  />

  <TresPointLightHelper
    v-if="pointLightRef"
    ref="pointLightHelperRef"
    :args="[pointLightRef, 1, 0xff0000]"
  />

  <TresDirectionalLight
    ref="directionLightRef"
    v-light-helper
    :position="new Vector3(0, 2, 5)"
    :lookAt="initialLookAtPosition"
    :intensity="1"
  />

  <TresDirectionalLightHelper
    v-if="directionLightRef"
    ref="directionLightHelperRef"
    :args="[directionLightRef, 1, 0x00ff00]"
  />

  <!-- ------ HELPERS ------ -->

  <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" />

  <OrbitControls
    ref="controls"
    :enableDamping="false"
    :target="initialLookAtPosition"
  />
</template>

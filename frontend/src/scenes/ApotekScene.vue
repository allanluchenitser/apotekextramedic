<script setup lang="ts">

import apotekGlbUrl from '@/assets/glb/apotekScene.glb?url'

import { OrbitControls, useGLTF } from '@tresjs/cientos'
import { useLoop, useTresContext } from '@tresjs/core'

import { Vector3 } from 'three'

import { toFixed } from '@/js/util'

const { camera } = useTresContext();
const { onBeforeRender } = useLoop();

const {
  state: apotekState,
  nodes: apotekNodes,
  materials: apotekMaterials
} = useGLTF(apotekGlbUrl)


// Initial camera position
// X: -10.74, Y: 5.24, Z: 23.37
const initialCameraPosition = new Vector3(-7.74, 8.24, 22.68);
const initialLookAtPosition = new Vector3(0, 0, 0);

const emit = defineEmits<{
  position: [position: Vector3]
}>();

onBeforeRender(() => {
  const pos = camera.activeCamera.value?.position;

  if (!pos) return;

  const x = toFixed(pos.x, 2)
  const y = toFixed(pos.y, 2)
  const z = toFixed(pos.z, 2)

  emit('position', new Vector3(x, y, z));
});

</script>

<template>
  <TresPerspectiveCamera
    :position="initialCameraPosition"
    :look-at="initialLookAtPosition"
  />

  <TresAmbientLight
    :intensity="0.5"
    color="white"
  />

  <primitive
    v-if="apotekState"
    :object="apotekState.scene"
  />

  <TresDirectionalLight
    :position="new Vector3(0, 2, 4)"
    :intensity="1"
    cast-shadow
  />

  <TresAxesHelper />
  <TresGridHelper :args="[10, 10]" />
  <OrbitControls
    :enableDamping="false"
  />
</template>

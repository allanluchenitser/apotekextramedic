<script setup lang="ts">

import apotekGlbUrl from '@/assets/glb/apotekScene.glb?url'

import { OrbitControls, useGLTF } from '@tresjs/cientos'
import { Vector3 } from 'three'

const {
  state: apotekState,
  nodes: apotekNodes,
  materials: apotekMaterials
} = useGLTF(apotekGlbUrl)

</script>

<template>
  <TresPerspectiveCamera
    :position="new Vector3(0, 0, 30)"
    :look-at="new Vector3(0, 0, 0)"
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

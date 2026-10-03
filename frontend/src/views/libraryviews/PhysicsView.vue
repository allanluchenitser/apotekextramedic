<script setup lang="ts">
import { ref } from 'vue'
import { Vector3 } from 'three'
import { TresCanvas } from '@tresjs/core'

import { Physics, RigidBody } from '@tresjs/rapier'

import PlayerController from './PlayerController.vue'

const positionFloor = ref<Vector3>(new Vector3(0, -0.25, 0))
const positionWall = ref<Vector3>(new Vector3(0, 1.5, -4))
</script>

<template>
  <div class="physics-view">
    <div class="crosshairs
      absolute top-1/2 left-1/2
      transform -translate-x-1/2 -translate-y-1/2
      z-50"
    >
      <div
        class="
          absolute top-1/2 left-1/2
          transform -translate-x-1/2 -translate-y-1/2
          w-3 h-3 bg-white
          rounded-full
          flex items-center justify-center
      ">
        +
      </div>
    </div>
    <TresCanvas
      alpha
      :clear-alpha="0"
    >
      <TresAmbientLight :intensity="1" />

      <Suspense>
        <Physics debug>
          <PlayerController />

          <!-- floor -->
          <RigidBody type="fixed">
            <TresMesh :position="positionFloor">
              <TresBoxGeometry :args="[20, 0.5, 20]" />
              <TresMeshStandardMaterial color="#888888" :opacity="0.5" transparent />
            </TresMesh>
          </RigidBody>

          <!-- wall -->
          <RigidBody type="fixed">
            <TresMesh :position="positionWall">
              <TresBoxGeometry :args="[8, 50, 0.5]" />
              <TresMeshStandardMaterial color="#aa7777" />
            </TresMesh>
          </RigidBody>
        </Physics>
      </Suspense>
    </TresCanvas>
  </div>
</template>

<style scoped>
  .physics-view {
    width: 100%;
    height: 100vh;

    background: linear-gradient(to top, white, #d1edff);
  }
</style>
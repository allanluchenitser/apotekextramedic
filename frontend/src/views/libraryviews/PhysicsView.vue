<script setup lang="ts">
import { Physics, RigidBody } from '@tresjs/rapier'

import { Vector3 } from 'three'
import { TresCanvas } from '@tresjs/core'
import PlayerController from './PlayerController.vue'

import { ref } from 'vue'

const positionBoxOne = ref<Vector3>(new Vector3(0, -0.25, 0))
const positionBoxTwo = ref<Vector3>(new Vector3(0, 1.5, -4))
</script>

<template>
  <div class="physics-view">
    <TresCanvas alpha :clear-alpha="0">
      <TresAmbientLight :intensity="1" />

      <Suspense>
        <Physics debug>
          <PlayerController />

          <!-- floor -->
          <RigidBody type="fixed">
            <TresMesh :position="positionBoxOne">
              <TresBoxGeometry :args="[20, 0.5, 20]" />
              <TresMeshStandardMaterial color="#888888" />
            </TresMesh>
          </RigidBody>

          <!-- wall -->
          <RigidBody type="fixed">
            <TresMesh :position="positionBoxTwo">
              <TresBoxGeometry :args="[8, 3, 0.5]" />
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
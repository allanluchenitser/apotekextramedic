<script setup lang="ts">
import { ref, shallowRef, watch, nextTick } from 'vue'
import { Vector3 } from 'three'
import { TresCanvas } from '@tresjs/core'

import {
  Physics,
  RigidBody,
  type ExposedRigidBody
} from '@tresjs/rapier'

import PlayerController from './PlayerController.vue'

const positionFloor = ref<Vector3>(new Vector3(0, -0.25, 0))
const positionWall = ref<Vector3>(new Vector3(0, 1.5, -4))

const wallRef = shallowRef<ExposedRigidBody | null>(null);

watch(
  () => wallRef.value?.instance,
  async (body) => {
    if (!body) return;

    await nextTick()

    console.table(
      Array.from({ length: body.numColliders() }, (_, index) => {
        const collider = body.collider(index)
        return {
          index,
          isSensor: collider.isSensor(),
          shapeType: collider.shapeType(),
          enabled: collider.isEnabled(),
        }
      }),
    )
  },
  { immediate: true, flush: 'post' },
)

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
      :clear-alpha="0"
      alpha
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
          <RigidBody
            ref="wallRef"
            type="fixed"
          >
            <TresMesh :position="positionWall">
              <TresBoxGeometry :args="[8, 10, 0.5]" />
              <TresMeshStandardMaterial color="blue" />
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
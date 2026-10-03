<script setup lang="ts">
import { shallowRef, watch, nextTick } from 'vue'

import { Vector3 } from 'three'
import { PointerLockControls } from '@tresjs/cientos'

import { usePlayerMovement } from './usePlayerMovement'

import {
  Collider,
  RigidBody,
  type ExposedCollider,
  type ExposedRigidBody,
} from '@tresjs/rapier'

type PointerControlsHandle = {
  instance: {
    minPolarAngle: number
    maxPolarAngle: number
    pointerSpeed: number
  } | null
}

const playerRef = shallowRef<ExposedRigidBody | null>(null);
const capsuleColliderRef = shallowRef<ExposedCollider | null>(null)

const cameraPosition = shallowRef<Vector3>(new Vector3(0, 0.65, 0));

const pointerLockControls = shallowRef<PointerControlsHandle | null>(null)

usePlayerMovement(playerRef, capsuleColliderRef, 5)

watch(() => pointerLockControls.value?.instance, (controls) => {
  if (!controls) return

  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = 5 * Math.PI / 8
  controls.pointerSpeed = 0.9
});

watch(
  () => playerRef.value?.instance,
  async (body) => {
    if (!body) return;

    await nextTick();

    console.table(
      Array.from({ length: body.numColliders() }, (_, index) => {
        const collider = body.collider(index);
        return {
          index,
          isSensor: collider.isSensor(),
          shapeType: collider.shapeType(),
          enabled: collider.isEnabled(),
        }
      })
    )
  },
  { immediate: true, flush: 'post' }
)

</script>

<template>
  <RigidBody
    ref="playerRef"
    type="kinematic"
    :collider="false"
    :position="[0, 1, 4]"
  >
    <Collider
      shape="capsule"
      ref="capsuleColliderRef"
      :args="[0.65, 0.35]"
    />

    <TresPerspectiveCamera
      :position="cameraPosition"
      :fov="60"
    />

    <PointerLockControls
      ref="pointerLockControls"
      make-default
    />
  </RigidBody>
</template>
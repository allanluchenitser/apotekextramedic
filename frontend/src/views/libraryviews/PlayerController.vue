<script setup lang="ts">
import { shallowRef, onMounted, watchEffect } from 'vue'

import { Vector3 } from 'three'
import { PointerLockControls } from '@tresjs/cientos'

import { usePlayerMovement } from './usePlayerMovement'

import {
  CapsuleCollider,
  RigidBody,
  type ExposedRigidBody,
} from '@tresjs/rapier'

type PointerControlsHandle = {
  instance: {
    minPolarAngle: number
    maxPolarAngle: number
    pointerSpeed: number
  } | null
}

const playerRef = shallowRef<ExposedRigidBody | null>(null)
const cameraPosition = shallowRef<Vector3>(new Vector3(0, 0.65, 0))
const capsuleColliderRef = shallowRef(null)

const pointerLockControls = shallowRef<PointerControlsHandle | null>(null)

watchEffect(() => {
  const controls = pointerLockControls.value?.instance
  if (!controls) return

  controls.minPolarAngle = Math.PI / 4
  controls.maxPolarAngle = 5 * Math.PI / 8
  controls.pointerSpeed = 0.9
})

usePlayerMovement(playerRef, capsuleColliderRef, 5)

</script>

<template>
  <RigidBody
    ref="playerRef"
    type="kinematic"
    :collider="false"
    :position="[0, 1, 4]"
  >
    <CapsuleCollider
      ref="capsuleColliderRef"
      :args="[0.65, 0.35]"
    />

    <TresPerspectiveCamera
      :position="cameraPosition"
      :fov="60"
    />

    <PointerLockControls
      make-default
      ref="pointerLockControls"
    />
  </RigidBody>
</template>
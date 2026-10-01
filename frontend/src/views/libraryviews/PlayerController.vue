<script setup lang="ts">
import { shallowRef } from 'vue'
import { Vector3 } from 'three'
import { PointerLockControls } from '@tresjs/cientos'
import {
  CapsuleCollider,
  RigidBody,
  type ExposedRigidBody,
} from '@tresjs/rapier'

const player = shallowRef<ExposedRigidBody | null>(null)
const cameraPosition = shallowRef<Vector3>(new Vector3(0, 0.65, 0))
</script>

<template>
  <RigidBody
    ref="player"
    type="kinematic"
    :collider="false"
    :position="[0, 1, 4]"
  >
    <CapsuleCollider :args="[0.65, 0.35]" />

    <TresPerspectiveCamera
      :position="cameraPosition"
      :fov="60"
    />

    <PointerLockControls />
  </RigidBody>
</template>
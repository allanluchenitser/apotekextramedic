<script setup lang="ts">
import type * as THREE from 'three'

import { shallowRef } from 'vue'

import { Vector3 } from 'three'

import { usePlayerMovement } from '../composables/player/usePlayerMovement'
import { useDragLook } from '../composables/player/useDragLook'
import useTresLoopDebug from '@/composables/useTresLoopDebug'

import {
  Collider,
  RigidBody,
  type ExposedCollider,
  type ExposedRigidBody,
} from '@tresjs/rapier'

// useTresLoopDebug()

const props = defineProps<{
  initialCameraPosition?: Vector3
  initialCameraLookAt?: Vector3
}>()

const customerRef = shallowRef<ExposedRigidBody | null>(null);
const customerColliderRef = shallowRef<ExposedCollider | null>(null)

const cameraInitialPosition = props.initialCameraPosition ?? new Vector3(0, 0.65, 0);
const cameraInitialLookAt = props.initialCameraLookAt ?? new Vector3(0, 0.65, -1);

const cameraPosition = shallowRef<Vector3>(cameraInitialPosition);
const customerPOVCameraRef = shallowRef<THREE.Camera | null>(null)

usePlayerMovement({
  bodyRef: customerRef,
  colliderRef: customerColliderRef,
  cameraRef: customerPOVCameraRef,
  speed: 5,
})

useDragLook({
  cameraRef: customerPOVCameraRef,
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: 5 * Math.PI / 8,
})

</script>

<template>
  <RigidBody
    ref="customerRef"
    type="kinematic"
    :collider="false"
    :position="[0, 1, 4]"
  >
    <Collider
      shape="capsule"
      ref="customerColliderRef"
      :position="[0, 0, 0]"
      :args="[0.65, 0.35]"
    />

    <TresPerspectiveCamera
      ref="customerPOVCameraRef"
      :position="cameraPosition"
      :lookAt="cameraInitialLookAt"
      :fov="60"
    />
  </RigidBody>
</template>
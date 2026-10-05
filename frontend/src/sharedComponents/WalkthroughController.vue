<script setup lang="ts">
import type * as THREE from 'three'

import { shallowRef } from 'vue'

import { Vector3 } from 'three'

import { usePlayerMovement } from '../composables/player/usePlayerMovement'
import { useDragLook } from '../composables/player/useDragLook'
// import useTresLoopDebug from '@/composables/useTresLoopDebug'

import {
  Collider,
  RigidBody,
  type ExposedCollider,
  type ExposedRigidBody,
} from '@tresjs/rapier'

// useTresLoopDebug()

const props = defineProps<{
  initialPosition?: Vector3
  initialLookAt?: Vector3
}>()

const customerRef = shallowRef<ExposedRigidBody | null>(null);
const customerColliderRef = shallowRef<ExposedCollider | null>(null)
const customerPOVCameraRef = shallowRef<THREE.Camera | null>(null)

const position = props.initialPosition ?? new Vector3(0, 0.65, 0);
const lookAt = props.initialLookAt ?? new Vector3(0, 0, 0);

const localCamPos = new Vector3(0, 0.65, 0);


usePlayerMovement({
  bodyRef: customerRef,
  cameraRef: customerPOVCameraRef,
  colliderRef: customerColliderRef,
  speed: 5,
})

useDragLook({
  cameraRef: customerPOVCameraRef,
  minPolarAngle: Math.PI / 4,
  maxPolarAngle: 5 * Math.PI / 8,
  lookAt,
})

</script>

<template>
  <RigidBody
    ref="customerRef"
    type="kinematic"
    :collider="false"
    :position="position"
  >
    <Collider
      shape="capsule"
      ref="customerColliderRef"
      :position="[0, 0, 0]"
      :args="[0.65, 0.35]"
    />

    <TresPerspectiveCamera
      ref="customerPOVCameraRef"
      :position="localCamPos"
      :fov="60"
    />
  </RigidBody>
</template>
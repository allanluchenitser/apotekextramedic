import type * as THREE from 'three'

import { onUnmounted, type ShallowRef } from 'vue'
import { Vector3 } from 'three'
import { useTresContext } from '@tresjs/core'
import {
  useRapier,
  type ExposedRigidBody,
} from '@tresjs/rapier'

import { useWASDKeys } from './useWASDKeys'

type UsePlayerMovementParams = {
  bodyRef: ShallowRef<ExposedRigidBody | null>,
  colliderRef: ShallowRef<any>,
  cameraRef: ShallowRef<THREE.Camera | null>,
  speed?: number,
  allowVerticalMovement?: boolean,
}

export function usePlayerMovement({
  bodyRef,
  colliderRef,
  cameraRef,
  speed = 3,
  allowVerticalMovement = false,
}: UsePlayerMovementParams) {
  const { keys } = useWASDKeys()

  const { camera } = useTresContext()
  const { world, onBeforeStep } = useRapier()

  // Small safety gap around the character.
  const controller = world.value.createCharacterController(0.01)
  controller.enableAutostep(0.5, 0.05, true)

  const forward = new Vector3()
  const right = new Vector3()
  const movement = new Vector3()
  const up = new Vector3(0, 1, 0)

  onBeforeStep((dt) => {
    // console.log('before step')

    const _speed = keys.shift
      ? speed * 2.5
      : speed

    const body = bodyRef.value?.instance
    const collider = colliderRef.value?.instance
    const cam = cameraRef.value || camera.activeCamera.value

    if (!body || !collider || !cam) {
      console.warn('Missing body, collider, or camera')
      console.log({
        player: !!bodyRef.value,
        colliderRef: !!colliderRef.value,
        colliderInstance: !!colliderRef.value?.instance,
      })
      return
    }

    movement.set(0, 0, 0)

    // Where is the camera looking?
    cam.getWorldDirection(forward)

    // Ignore looking up/down for walking.
    forward.y = 0
    forward.normalize()

    // Camera-relative right direction.
    right.crossVectors(forward, up).normalize()

    if (keys.forward) movement.add(forward)
    if (keys.backward) movement.sub(forward)
    if (keys.right) movement.add(right)
    if (keys.left) movement.sub(right)
    if (allowVerticalMovement && keys.up) movement.y += 1
    if (allowVerticalMovement && keys.down) movement.y -= 1

    if (movement.lengthSq() === 0) {
      return
    }

    // Prevent W+D from being faster than W alone.
    movement.normalize().multiplyScalar(_speed * dt)

    // Ask Rapier how much of that movement is legal.
    controller.computeColliderMovement(collider, movement);

    const corrected = controller.computedMovement()

    // console.log({
    //   desired: movement.toArray(),
    //   corrected: [corrected.x, corrected.y, corrected.z],
    //   collisions: controller.numComputedCollisions(),
    // })

    const current = body.translation()

    body.setNextKinematicTranslation({
      x: current.x + corrected.x,
      y: current.y + corrected.y,
      z: current.z + corrected.z,
    })
  })

  onUnmounted(() => {
    world.value.removeCharacterController(controller)
  })
}
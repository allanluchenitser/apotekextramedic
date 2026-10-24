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
  controller.enableSnapToGround(0.5);

  const forward = new Vector3()
  const right = new Vector3()
  const movement = new Vector3()
  const up = new Vector3(0, 1, 0)

  // Head bobbing parameters and state
  const BOB_FREQ = .15      // steps per meter travelled (≈ cycles per meter)
  const BOB_AMP_Y = 0.04    // meters
  const BOB_AMP_X = 0.02
  let bobPhase = 0
  let bobWeight = 0         // 0..1, eases in/out so it settles when stopping
  let baseCamY: number | null = null
  let baseCamX = 0

  onBeforeStep((dt) => {
    // console.log('before step')

    const _speed = keys.shift
      ? speed * 2.5
      : speed

    const bodyInstance = bodyRef.value?.instance
    const colliderInstance = colliderRef.value?.instance
    const cam = cameraRef.value || camera.activeCamera.value

    if (!bodyInstance || !colliderInstance || !cam) {
      console.warn('Missing body, collider, or camera')
      console.log({
        player: !!bodyInstance,
        colliderRef: !!colliderRef.value,
        colliderInstance: !!colliderInstance,
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

    const moving = movement.lengthSq() > 0

    const camObj = cameraRef.value
    if (camObj) {
      if (baseCamY === null) {
        baseCamY = camObj.position.y
        baseCamX = camObj.position.x
      }

      const targetWeight = moving && !keys.up && !keys.down ? 1 : 0
      bobWeight += (targetWeight - bobWeight) * Math.min(1, dt * 10)

      if (moving) bobPhase += _speed * dt * BOB_FREQ * Math.PI * 2

      camObj.position.y = baseCamY + Math.sin(bobPhase * 2) * BOB_AMP_Y * bobWeight
      camObj.position.x = baseCamX + Math.cos(bobPhase) * BOB_AMP_X * bobWeight
    }

    if (!moving) return

    // Prevent W+D from being faster than W alone.
    movement.normalize().multiplyScalar(_speed * dt)

    // Ask Rapier how much of that movement is legal.
    controller.computeColliderMovement(colliderInstance, movement);

    const corrected = controller.computedMovement()

    // console.log({
    //   desired: movement.toArray(),
    //   corrected: [corrected.x, corrected.y, corrected.z],
    //   collisions: controller.numComputedCollisions(),
    // })

    const current = bodyInstance.translation()

    bodyInstance.setNextKinematicTranslation({
      x: current.x + corrected.x,
      y: current.y + corrected.y,
      z: current.z + corrected.z,
    })
  })

  onUnmounted(() => {
    world.value.removeCharacterController(controller)
  })
}
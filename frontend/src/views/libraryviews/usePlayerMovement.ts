import { onUnmounted, type ShallowRef } from 'vue'
import { Vector3 } from 'three'
import { useTresContext } from '@tresjs/core'
import {
  useRapier,
  type ExposedRigidBody,
} from '@tresjs/rapier'

import { useWASD } from './useWASD'

export function usePlayerMovement(
  bodyRef: ShallowRef<ExposedRigidBody | null>,
  colliderRef: ShallowRef<any>,
  speed = 3,
) {
  const { keys } = useWASD()

  const { camera } = useTresContext()
  const { world, onBeforeStep } = useRapier()

  // Small safety gap around the character.
  const controller = world.value.createCharacterController(0.01)

  const forward = new Vector3()
  const right = new Vector3()
  const movement = new Vector3()
  const up = new Vector3(0, 1, 0)

  onBeforeStep((dt) => {
    const body = bodyRef.value?.instance
    const collider = colliderRef.value?.instance
    const cam = camera.activeCamera.value

    if (!body || !collider || !cam) return

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

    if (movement.lengthSq() === 0) return

    // Prevent W+D from being faster than W alone.
    movement.normalize()

    // meters/sec × seconds
    movement.multiplyScalar(speed * dt)

    // Ask Rapier how much of that movement is legal.
    controller.computeColliderMovement(collider, {
      x: movement.x,
      y: movement.y,
      z: movement.z,
    })

    const corrected = controller.computedMovement()
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
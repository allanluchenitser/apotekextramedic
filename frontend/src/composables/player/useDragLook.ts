import type * as THREE from 'three'

import { onBeforeUnmount, watch, type ShallowRef } from 'vue'
import { useTresContext } from '@tresjs/core'

type UseDragLookParams = {
  cameraRef: ShallowRef<THREE.Camera | null>,
  minPolarAngle?: number,
  maxPolarAngle?: number,
  sensitivity?: number,
}

export function useDragLook({
  cameraRef,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
  sensitivity = 0.003,
}: UseDragLookParams) {
  const { renderer } = useTresContext()

  let dragging = false
  let element: HTMLElement | null = null

  function onPointerDown(e: PointerEvent) {
    dragging = true
    element?.setPointerCapture(e.pointerId)
  }

  function onPointerUp(e: PointerEvent) {
    dragging = false
    element?.releasePointerCapture(e.pointerId)
  }

  function onPointerMove(e: PointerEvent) {
    const cam = cameraRef.value
    if (!dragging || !cam) return

    cam.rotation.order = 'YXZ'

    // Dragging "grabs" the scene, so the view turns opposite to the pointer.
    cam.rotation.y -= e.movementX * sensitivity
    cam.rotation.x -= e.movementY * sensitivity

    cam.rotation.x = Math.max(
      Math.PI / 2 - maxPolarAngle,
      Math.min(Math.PI / 2 - minPolarAngle, cam.rotation.x),
    )
  }

  function detach() {
    element?.removeEventListener('pointerdown', onPointerDown)
    element?.removeEventListener('pointerup', onPointerUp)
    element?.removeEventListener('pointermove', onPointerMove)
    element = null
  }

  watch(
    () => renderer.instance?.domElement,
    (dom) => {
      detach()
      if (!dom) return

      element = dom
      element.addEventListener('pointerdown', onPointerDown)
      element.addEventListener('pointerup', onPointerUp)
      element.addEventListener('pointermove', onPointerMove)
    },
    { immediate: true },
  )

  onBeforeUnmount(detach)
}

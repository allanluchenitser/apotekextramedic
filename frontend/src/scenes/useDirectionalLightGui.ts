import {
  onMounted,
  onUnmounted,
  watch,
  type ShallowRef,
} from 'vue'

import GUI from 'lil-gui'
import type {
  DirectionalLight,
  DirectionalLightHelper,
} from 'three'

export function useDirectionalLightGui(
  gui: GUI,
  lightRef: ShallowRef<DirectionalLight | null>,
  helperRef?: ShallowRef<DirectionalLightHelper | null>,
) {
  let stopWatching: (() => void) | null = null
  let lightFolder: GUI | null = null
  onMounted(() => {
    stopWatching = watch(
      lightRef,
      (light) => {
        lightFolder?.destroy()
        lightFolder = null

        if (!light) return

        const updateHelper = () => {
          light.updateMatrixWorld()
          light.target.updateMatrixWorld()
          helperRef?.value?.update()
        }

        lightFolder = gui.addFolder('Directional light')

        lightFolder
          .add(light.position, 'x', -20, 20, 0.1)
          .onChange(updateHelper)

        lightFolder
          .add(light.position, 'y', -20, 20, 0.1)
          .onChange(updateHelper)

        lightFolder
          .add(light.position, 'z', -20, 20, 0.1)
          .onChange(updateHelper)

        lightFolder
          .add(light.target.position, 'x', -20, 20, 0.1).name('tx')
          .onChange(updateHelper)

        lightFolder
          .add(light.target.position, 'y', -20, 20, 0.1).name('ty')
          .onChange(updateHelper)

        lightFolder
          .add(light.target.position, 'z', -20, 20, 0.1).name('tz')
          .onChange(updateHelper)

        lightFolder
          .add(light, 'intensity', 0, 10, 0.01)
          .name('Intensity')

      },
      {
        immediate: true,
        flush: 'post',
      },
    )
  })

  onUnmounted(() => {
    stopWatching?.()
    lightFolder?.destroy()
  })
}
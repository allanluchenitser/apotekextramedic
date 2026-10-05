import {
  onMounted,
  onUnmounted,
  watch,
  type ShallowRef,
} from 'vue'

import GUI from 'lil-gui'

import type {
  PointLight,
  PointLightHelper,
} from 'three'

export function usePointLightGui(
  gui: GUI,
  lightRef: ShallowRef<PointLight | null>,
  helperRef?: ShallowRef<PointLightHelper | null>,
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
          helperRef?.value?.update()
        }

        lightFolder = gui.addFolder('Point light')

        // ------ Position Controls ------

        lightFolder
          .add(light.position, 'x', -20, 20, 0.1)
          .onChange(updateHelper)

        lightFolder
          .add(light.position, 'y', -20, 20, 0.1)
          .onChange(updateHelper)

        lightFolder
          .add(light.position, 'z', -20, 20, 0.1)
          .onChange(updateHelper)

        // ------ Light Properties ------

        lightFolder
          .add(light, 'intensity', 0, 500, 1)
          .name('Intensity')

        lightFolder
          .add(light, 'distance', 0, 100, 0.1)
          .name('Distance')

        lightFolder
          .add(light, 'decay', 0, 4, 0.01)
          .name('Decay')
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
<!-- @strictTemplates false -->

<script setup lang="ts">
import { ref } from 'vue'

import GoogleSideBar from '@/sharedComponents/GoogleSideBar.vue'
import ApotekScene from '@/scenes/ApotekScene.vue'
import DisplayCoordinates from '@/sharedComponents/DisplayCoordinates.vue';

import { Vector3 } from 'three'
import { TresCanvas } from '@tresjs/core'
import { TresLeches } from '@tresjs/leches'
import { DEBUG } from '@/views/apotekview/apotekConfig'

const dpr = Math.min(window.devicePixelRatio, 1.5)
const positionData = ref({
  position: new Vector3(0, 0, 0),
  rotation: new Vector3(0, 0, 0),
  lookAt: new Vector3(0, 0, 0)
})

</script>

<template>
  <div class="apotek-view">
    <GoogleSideBar width="var(--left-sidebar-width)" side="left" />
    <div class="main-content">
      <div class="main-content-wrapper">
        <TresLeches />
        <TresCanvas
          alpha
          :clear-alpha="0"
          :dpr="dpr"
        >
          <ApotekScene @position="positionData = $event" />
          <!-- <ApotekScene /> -->
        </TresCanvas>

        <DisplayCoordinates v-if="DEBUG.showCoordinates && positionData" :position="positionData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.apotek-view {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to top, white, #d1edff);

  .main-content {
    flex: 1;
    width: 100%;
    padding-left: var(--left-sidebar-width);
    height: 100vh;

    .main-content-wrapper {
      height: 100%;
      position: relative;
    }
  }
}
</style>

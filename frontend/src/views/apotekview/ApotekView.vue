<!-- @strictTemplates false -->

<script setup lang="ts">

import GoogleSideBar from '@/sharedComponents/GoogleSideBar.vue'
import ApotekScene from '@/scenes/ApotekScene.vue'
// import DisplayCoordinates from '@/sharedComponents/DisplayCoordinates.vue';

import { TresCanvas } from '@tresjs/core'
import { TresLeches } from '@tresjs/leches'
// import { DEBUG } from '@/views/apotekConfig'

const dpr = Math.min(window.devicePixelRatio, 1.5)

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
          <!-- <ApotekScene @position="positionData = $event" /> -->
          <ApotekScene />
        </TresCanvas>

        <!-- <DisplayCoordinates v-if="DEBUG.showCoordinates" :position="positionData.position" /> -->
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

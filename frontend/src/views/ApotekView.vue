<!-- @strictTemplates false -->

<script setup lang="ts">
import ControlSideBar from '@/components/ControlSideBar.vue'
import GoogleSideBar from '@/components/GoogleSideBar.vue'

import ApotekScene from '@/scenes/ApotekScene.vue'

import { TresCanvas } from '@tresjs/core'

</script>

<template>
  <div class="apotek-view">
    <GoogleSideBar width="var(--left-sidebar-width)" side="left" />
    <div class="main-content">
      <TresCanvas
        alpha
        :clear-alpha="0"
      >
        <ApotekScene />
      </TresCanvas>
    </div>
    <!-- <ControlSideBar
      side="right"
      width="var(--right-sidebar-width)"
    /> -->
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
  }
}
</style>

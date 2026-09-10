<!-- @strictTemplates false -->

<script setup lang="ts">
import DesktopSideBar from './DesktopSideBar.vue'
import Tutorial from '@/components/Tutorial.vue'
import { TresCanvas } from '@tresjs/core'

</script>

<template>
  <div class="desktop-view">
    <DesktopSideBar side="left" />
    <div class="main-content">
      <TresCanvas
        clear-color="black"
      >
        <Tutorial />
      </TresCanvas>
    </div>
  </div>
</template>

<style scoped>
.desktop-view {
  height: 100vh;
  width: 100%;

  .main-content {
    flex: 1;
    width: 100%;
    padding-left: var(--sidebar-width);
    height: 100vh;
  }
}
</style>

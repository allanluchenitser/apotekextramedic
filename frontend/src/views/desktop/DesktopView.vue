<!-- @strictTemplates false -->

<script setup lang="ts">
import DesktopSideBar from './DesktopSideBar.vue'
import { TresCanvas } from '@tresjs/core'

import TheExperience from '@/components/TheExperience.vue'

</script>

<template>
  <div class="desktop-view">
    <DesktopSideBar side="left" />
    <div class="main-content">
      <TresCanvas
        clear-color="#82DBC5"
      >
        <TheExperience />
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

    img {
      object-fit: cover;
      object-position: center;
      height: 100%;
      max-width: 100%;
    }
  }
}
</style>

<!-- @strictTemplates false -->

<script setup lang="ts">
import { ref } from 'vue'
import { Vector3 } from 'three'

import GoogleSideBar from '@/components/GoogleSideBar.vue'
import ApotekScene from '@/scenes/ApotekScene.vue'
import DisplayCoordinates from '@/components/DisplayCoordinates.vue';

import { TresCanvas } from '@tresjs/core'

const position = ref(new Vector3(0, 0, 0));
</script>

<template>
  <div class="apotek-view">
    <GoogleSideBar width="var(--left-sidebar-width)" side="left" />
    <div class="main-content">
      <div class="main-content-wrapper">
        <TresCanvas
          alpha
          :clear-alpha="0"
        >
          <ApotekScene @position="position = $event" />
        </TresCanvas>
        <DisplayCoordinates :position="position"/>
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

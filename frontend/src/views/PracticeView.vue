<!-- @strictTemplates false -->

<script setup lang="ts">
import { ref } from 'vue'
import ControlSideBar from '@/components/ControlSideBar.vue'
import DesktopSideBar from '@/components/GoogleSideBar.vue'
import PracticeScene from '@/scenes/PracticeScene.vue'
import { TresCanvas } from '@tresjs/core'

const numberOfTorus = ref(1);

</script>

<template>
  <div class="practice-view">
    <DesktopSideBar width="var(--left-sidebar-width)" side="left" />
    <div class="main-content">
      <TresCanvas
        clear-color="black"
      >
        <PracticeScene
          :number-of-torus="numberOfTorus"
        />
      </TresCanvas>
    </div>
    <ControlSideBar
      side="right"
      width="var(--right-sidebar-width)"
      :number-of-torus="numberOfTorus"
      @select="numberOfTorus = $event"
    />
  </div>
</template>

<style scoped>
.practice-view {
  height: 100vh;
  width: 100%;

  .main-content {
    flex: 1;
    width: 100%;
    padding-left: var(--left-sidebar-width);
    padding-right: var(--right-sidebar-width);
    height: 100vh;
  }
}
</style>

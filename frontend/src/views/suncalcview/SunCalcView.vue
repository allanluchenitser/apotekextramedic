<script setup lang="ts">
import SunCalcScene from '@/scenes/SunCalcScene.vue'
import { TresCanvas } from '@tresjs/core'
</script>

<template>
<div class="suncalc-view">
  <TresCanvas
    clear-color="lightblue"
  >
    <SunCalcScene />
  </TresCanvas>
</div>
</template>


<style scoped>
.suncalc-view {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to top, white, #d1edff);
}
</style>

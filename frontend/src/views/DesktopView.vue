<script setup lang="ts">
import DesktopSideBar from './DesktopSideBar.vue'
</script>

<template>
  <div class="desktop-view">
    <DesktopSideBar side="left" />
    <div class="main-content">
      <img src="@/assets/storefront_prototype.webp" alt="Storefront Prototype" />
    </div>
  </div>
</template>

<style scoped>
.desktop-view {
  height: 100vh;
  width: 100vw;

  .main-content {
    flex: 1;
    width: calc(100vw - var(--sidebar-width));

    img {
      height: 100%;
      max-height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
}
</style>

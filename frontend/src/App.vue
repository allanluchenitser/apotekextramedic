<script setup lang="ts">
import PracticeView from '@/views/PracticeView.vue'
import ApotekView from '@/views/ApotekView.vue'
import ThreeView from '@/views/threeview/ThreeView.vue'

</script>

<template>
  <main class="app">
    <nav
      class="
        view-selection
        absolute bottom-1 right-1
        bg-white
        flex
        text-xs
        p-2
        [&>a]:hover:underline [&>a]:hover:cursor-pointer [&>a]:px-2
        z-1
      "
    >
      <router-link to="/apotek">apotek</router-link>
      <router-link to="/three">three</router-link>
      <router-link to="/practice">practice</router-link>
      <router-link to="/ortho">ortho</router-link>
    </nav>
    <router-view></router-view>
  </main>
</template>

<style>
:root {
  --left-sidebar-width: 325px;
  --right-sidebar-width: 325px;
}

.app {
  main {
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }
}
</style>

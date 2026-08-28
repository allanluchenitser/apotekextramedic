<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <main class="app">
    <h1>Vue 3 + TypeScript + Vite</h1>
    <p>Composition API is ready.</p>
    <button type="button" @click="count++">Count is: {{ count }}</button>
  </main>
</template>

<style scoped>
.app {
  display: grid;
  gap: 1rem;
  place-items: center;
  min-height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

button {
  border: 1px solid #1f2937;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
  background: #111827;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #1f2937;
}
</style>

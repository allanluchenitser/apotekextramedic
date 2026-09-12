<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'

const props = defineProps<{
  width: string
  numberOfTorus?: number
}>()

const emit = defineEmits<{
  select: [tors: number]
}>()

function updateTorus(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit('select', Number(value))
}
</script>

<template>
  <SideBar class="control-side-bar" side="right" :width="props.width">
    <div class="content-wrap flex flex-col justify-center text-center">
      <h1>Control Side Bar</h1>
      <p>
        This is the control side bar content.
      </p>
      <label>
        Number of Torus:
        <input type="range" min="1" max="100" :value="props.numberOfTorus" @input="updateTorus" />
      </label>
    </div>
  </SideBar>
</template>

<style scoped>
.control-side-bar .content-wrap {
  background-color: #f5f5f5;
  padding: 14px 18px;
}
</style>
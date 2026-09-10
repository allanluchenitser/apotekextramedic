<script setup lang="ts">

interface SideBarProps {
  side: 'left' | 'right',
  class?: string,
  src?: string
}

const props = defineProps<SideBarProps>()

</script>

<template>
  <div :class="['page-shell', props.class]">
    <aside class="sidebar">
      <div class="sidebar-content">
        <header v-if="props.src">
          <img :src="props.src" alt="Sidebar Header" />
        </header>
        <slot />
      </div>
    </aside>
  </div>
</template>

<style scoped>
.page-shell {
  background: #dfe6ec;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  left: 0;
  position: fixed;
  width: var(--sidebar-width);

  @media (max-width: 520px) {
    padding: 0;
  }

  .sidebar {
    height: 100vh;
    background: #f3f3f3;
    box-shadow: 0 12px 24px rgba(16, 26, 40, 0.08);
    width: 100%;

    .sidebar-content {
      background: #f7f7f7;
      scrollbar-width: thin;
      scrollbar-color: lightgray transparent;
      overflow-y: auto;
      height: 100%;
    }
  }
}
</style>

<script setup lang="ts">

interface SideBarProps {
  side: 'left' | 'right',
  class?: string,
  src?: string,
  width: string,
}

const props = defineProps<SideBarProps>()

</script>

<template>
  <div :class="['page-shell', props.class, props.side]" :style="{ width: props.width }">
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
  box-sizing: border-box;

  background: #dfe6ec;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  position: fixed;

  top: 0;
  left: 0;
  &.right {
    left: auto;
    right: 0;
  }

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

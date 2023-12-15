<script lang="ts" setup>
import AsideView from './components/AsideView.vue'
import HeaderView from './components/HeaderView.vue'
import ScrollBar from './components/ScrollBar.vue'
import ParentView from '@/components/ParentView/ParentView.vue';
</script>

<template>
  <div class="layout flex">
    <AsideView />
    <div class="layout_container">
      <HeaderView />
      <ScrollBar />
      <div class="layout-main st-transition-bg">
        <ParentView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  height: 100vh;
}

.layout_container {
  flex: 1;

  .layout-main {
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 80px);
    background-color: var(--st-c-bg-2);
  }
}

</style>

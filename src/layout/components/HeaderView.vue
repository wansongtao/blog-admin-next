<script lang="ts" setup>
import ButtonCollapsed from '@/components/ButtonCollapsed/ButtonCollapsed.vue';
import ScreenFull from '@/components/ScreenFull/ScreenFull.vue';
import HeaderAvatar from './HeaderAvatar.vue';
import BreadCrumb from './BreadCrumb.vue';
import SwitchTheme from './SwitchTheme.vue';
</script>

<template>
  <header class="header flex">
    <div class="flex">
      <ButtonCollapsed />
      <BreadCrumb />
    </div>
    <div class="flex">
      <ScreenFull />
      <SwitchTheme />
      <HeaderAvatar />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: var(--st-header-h);
  border-bottom: 1px solid var(--st-c-divider);
}
</style>
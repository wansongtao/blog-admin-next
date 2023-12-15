<script lang="ts" setup>
import {
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons-vue'

import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <div class="screen_full px-5">
    <fullscreen-exit-outlined v-show="isFullscreen" @click="toggle" />
    <fullscreen-outlined v-show="!isFullscreen" @click="toggle" />
  </div>
</template>

<style lang="scss" scoped>
.screen_full {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--st-c-icon);
}
</style>
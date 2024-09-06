<script lang="ts" setup>
import IconExpand from '@/assets/svgs/expand.svg?component'
import IconShrink from '@/assets/svgs/shrink.svg?component'
import { useFullscreen } from '@vueuse/core'

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <div class="button-fullscreen">
    <n-icon size="16" :component="isFullscreen ? IconShrink : IconExpand" @click="toggle"></n-icon>
  </div>
</template>

<style lang="scss" scoped>
.button-fullscreen {
  cursor: pointer;
}
</style>

<script lang="ts" setup>
import IconSun from '@/assets/svgs/sun.svg?component'
import IconMoon from '@/assets/svgs/moon.svg?component'
import { useAppSetStore } from '@/stores/appSet'
import { useOsTheme } from 'naive-ui'

const appSetStore = useAppSetStore()
const { toggleTheme } = appSetStore
const { theme } = storeToRefs(appSetStore)

const systemTheme = useOsTheme()
watch(
  systemTheme,
  (value) => {
    if (theme.value === value || !value) {
      return
    }

    toggleTheme()
  },
  { immediate: true }
)
</script>

<template>
  <div class="button-theme">
    <n-switch
      :value="theme"
      unchecked-value="light"
      checked-value="dark"
      @update-value="toggleTheme"
    >
      <template #icon>
        <n-icon size="12" :component="theme === 'light' ? IconSun : IconMoon"></n-icon>
      </template>
    </n-switch>
  </div>
</template>

<style lang="scss" scoped>
.button-theme {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
</style>

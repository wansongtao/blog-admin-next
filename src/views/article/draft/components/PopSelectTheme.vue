<script lang="ts" setup>
import IconTheme from '@/assets/svgs/menus/menu.svg'

export type IPreviewTheme =
  | 'default'
  | 'github'
  | 'vuepress'
  | 'mk-cute'
  | 'smart-blue'
  | 'cyanosis'

const options: { label: IPreviewTheme; value: IPreviewTheme }[] = [
  { label: 'default', value: 'default' },
  { label: 'github', value: 'github' },
  { label: 'vuepress', value: 'vuepress' },
  { label: 'mk-cute', value: 'mk-cute' },
  { label: 'smart-blue', value: 'smart-blue' },
  { label: 'cyanosis', value: 'cyanosis' }
]

const previewTheme = defineModel<IPreviewTheme>()
</script>

<template>
  <div class="icon">
    <n-popselect v-model:value="previewTheme" :options trigger="hover">
      <n-button text style="font-size: 16px">
        <icon-theme />
      </n-button>
      <template #header> Markdown 主题 </template>
    </n-popselect>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  position: absolute;
  top: 0;
  right: 220px;
  z-index: 99;
  display: flex;
  align-content: center;
  justify-content: center;
  width: 40px;
  height: 35px;
}
</style>

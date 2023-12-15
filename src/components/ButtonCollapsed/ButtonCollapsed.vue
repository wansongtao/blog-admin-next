<script lang="ts" setup>
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'

import { useSettingStore } from '@/stores/setting'
import { storeToRefs } from 'pinia'

const setStore = useSettingStore()
const { toggleCollapsed } = setStore
const { collapsed } = storeToRefs(setStore)
</script>

<template>
  <div class="collapsed mx-3 p-2 flex items-center" @click="toggleCollapsed">
    <menu-fold-outlined v-show="!collapsed" />
    <menu-unfold-outlined v-show="collapsed" />
  </div>
</template>

<style lang="scss" scoped>
.collapsed {
  cursor: pointer;
  font-size: 16px;
  color: var(--st-c-icon);
}
</style>
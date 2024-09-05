<script lang="ts" setup>
import AsideView from './components/AsideView.vue'
</script>

<template>
  <n-layout style="height: 100vh" has-sider>
    <aside-view />
    <n-layout>
      <header>header</header>
      <main>
        <parent-view />
      </main>
    </n-layout>
  </n-layout>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import AsideView from './components/AsideView.vue'
import HeaderView from './components/HeaderView.vue'
import ScrollBar from './components/ScrollBar.vue'
import { useSettingStore } from '@/stores/setting';
import { computed } from 'vue';

const settingStore = useSettingStore()
const include = computed(() => {
  return settingStore.cacheRoutes
})
</script>

<template>
  <div class="layout flex">
    <AsideView />
    <div class="layout_container">
      <HeaderView />
      <ScrollBar />
      <div class="layout-main st-transition-bg">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade">
            <KeepAlive :include="include">
              <component :is="Component" />
            </KeepAlive>
          </transition>
        </router-view>
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

.slide-fade-enter-active {
  animation: slide-fade 0.3s both;
}

.slide-fade-leave-active {
  display: none;
}

@keyframes slide-fade {
  from {
    transform: translateX(120px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// .slide-fade-enter-active {
//   animation: bounce-in-right 0.5s both;
// }

// @keyframes bounce-in-right {
//   0% {
//     transform: translateX(100px);
//     animation-timing-function: ease-in;
//     opacity: 0;
//   }
//   60% {
//     transform: translateX(0);
//     animation-timing-function: ease-out;
//     opacity: 1;
//   }
//   72% {
//     transform: translateX(48px);
//     animation-timing-function: ease-in;
//   }
//   81% {
//     transform: translateX(0);
//     animation-timing-function: ease-out;
//   }
//   85% {
//     transform: translateX(22px);
//     animation-timing-function: ease-in;
//   }
//   90% {
//     transform: translateX(0);
//     animation-timing-function: ease-out;
//   }
//   95% {
//     transform: translateX(8px);
//     animation-timing-function: ease-in;
//   }
//   100% {
//     transform: translateX(0);
//     animation-timing-function: ease-out;
//   }
// }
</style>

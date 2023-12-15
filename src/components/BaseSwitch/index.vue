<script lang="ts" setup>
import IconSun from '../icons/IconSun.vue'
import IconMoon from '../icons/IconMoon.vue'

import { ref, watch } from 'vue'
import { throttle } from '@/utils/index'

defineOptions({
  name: 'BaseSwitch'
})

const $props = withDefaults(defineProps<{ checked?: boolean; delay?: number }>(), {
  checked: false,
  delay: 0
})

const $emit = defineEmits<{
  onChange: [isChecked: boolean]
  'update:checked': [isChecked: boolean]
}>()

const status = ref($props.checked)
watch(
  () => $props.checked,
  (val) => {
    if (val === status.value) return
    status.value = val
  }
)

const changeStatus = () => {
  status.value = !status.value
  $emit('onChange', status.value)
  $emit('update:checked', status.value)
}
const handleChangeStatus = $props.delay ? throttle(changeStatus, $props.delay) : changeStatus
</script>

<template>
  <button class="base-switch" @click="handleChangeStatus">
    <span class="switch-check" :class="status ? 'switch-check--active' : ''">
      <span class="switch-icon">
        <slot :status="status">
          <IconSun v-show="!status" />
          <IconMoon v-show="status" />
        </slot>
      </span>
    </span>
  </button>
</template>

<style lang="scss" scoped>
.base-switch {
  position: relative;
  border-radius: 11px;
  display: block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border: 1px solid var(--st-c-divider);
  background-color: var(--st-c-bg-mute);
  transition: border-color 0.25s, background-color 0.25s;

  &:hover {
    border-color: var(--st-c-gray);
  }

  .switch-check {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1px;
    left: 1px;
    width: 18px;
    height: 18px;
    color: var(--st-c-text-1);
    border-radius: 50%;
    background-color: var(--st-c-bg);
    box-shadow: var(--st-shadow-1);
    transition: all 0.25s;
  }

  .switch-check--active {
    transform: translateX(18px);
  }

  .vt-switch-icon {
    position: relative;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>

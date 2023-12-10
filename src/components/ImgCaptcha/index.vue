<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getCaptcha } from '@/api/common/index'
import { debounce } from '@/utils';

defineOptions({
  name: 'ImgCaptcha'
})
const $props = defineProps<{
  isRefresh: boolean
}>()
const $emit = defineEmits<{
  'update:isRefresh': [boolean]
}>()

const img = ref<string>('')
const getCaptchaImg = debounce(() => {
  getCaptcha().then((res) => {
    img.value = res.data

    $emit('update:isRefresh', false)
  })
}, 400)

watch(
  () => $props.isRefresh,
  (val) => {
    if (val) {
      getCaptchaImg()
    }
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <img :src="img" alt="captcha" class="code" @click="getCaptchaImg" />
</template>

<style lang="scss" scoped>
.code {
  height: 32px;
  cursor: pointer;
}
</style>

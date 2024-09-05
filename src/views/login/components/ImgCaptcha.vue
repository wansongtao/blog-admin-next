<script lang="ts" setup>
import { getCaptcha } from '@/api/common'

const src = ref('')
const refreshCaptchaImg = async () => {
  const [, res] = await getCaptcha()
  if (!res) return

  src.value = res.data.captcha
}

onMounted(() => {
  refreshCaptchaImg()
})

defineExpose({
  refreshCaptchaImg
})
</script>

<template>
  <div class="img_captcha">
    <img :src alt="captcha" @click="refreshCaptchaImg" />
  </div>
</template>

<style lang="scss" scoped>
.img_captcha {
  width: 100%;
  height: 34px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>

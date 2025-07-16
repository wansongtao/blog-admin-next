<script lang="ts" setup>
const { id } = defineProps<{ id: number }>()

const router = useRouter()

const onJump = async () => {
  router.push({
    path: '/article/draft',
    query: {
      id
    }
  })
}
</script>

<template>
  <div class="button-edit">
    <n-button type="warning" ghost size="small" @click="onJump">编辑</n-button>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import UserCard from './components/UserCard.vue'

import { getProfile } from '@/api/common'

import type { IProfile } from '@/types/api/common'

const profile = ref<IProfile>({
  userName: '',
  roles: [],
  gender: 'OT'
})

const fetchProfile = async () => {
  const [, result] = await getProfile()
  if (result) {
    profile.value = result.data
  }
}

fetchProfile()
</script>

<template>
  <n-row :gutter="20">
    <n-col :span="8"><user-card :profile /></n-col>
    <n-col :span="16"></n-col>
  </n-row>
</template>

<style lang="scss" scoped></style>

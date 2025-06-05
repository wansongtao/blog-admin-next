<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useAppSetStore } from '@/stores/appSet'

defineProps<{
  previewTheme?: string
}>()

const appSetStore = useAppSetStore()
const { theme } = storeToRefs(appSetStore)

const content = defineModel<string>()
</script>

<template>
  <MdEditor v-model="content" :theme :toolbars-exclude="['save', 'github']" :preview-theme />
</template>

<style lang="scss" scoped></style>

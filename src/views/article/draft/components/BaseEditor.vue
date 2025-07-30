<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useAppSetStore } from '@/stores/appSet'
import { getPresignedUrl } from '@/api/common'
import { uploadFile } from '@/api/upload'

defineProps<{
  previewTheme?: string
}>()

const appSetStore = useAppSetStore()
const { theme } = storeToRefs(appSetStore)

const content = defineModel<string>()

const verifyFileSize = (file: File, maxSize = 5 * 1024 * 1024) => {
  const isLt = file.size < maxSize
  if (!isLt) {
    return false
  }

  return true
}

const handleUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  if (!files || files.length === 0) {
    callback([])
    return
  }
  const isLt5M = files.every((file) => verifyFileSize(file))
  if (!isLt5M) {
    window.$message.error('上传图片大小不能超过5MB')
    callback([])
    return
  }

  const res = await Promise.all(
    files.map(async (file) => {
      const [, result] = await getPresignedUrl(file.name)
      if (!result) {
        window.$message.error('获取上传地址失败')
        return ''
      }

      // 改为相对路径，通过代理转发后上传
      let url = result.data.presignedUrl
      const origin = new URL(url).origin
      if (origin !== window.location.origin) {
        url = url.replace(origin, '')
      }

      const [error] = await uploadFile(url, file)
      if (error) {
        window.$message.error('上传图片失败')
        return ''
      }

      return window.location.origin + import.meta.env.VITE_MINIO_API + url.replace(/\?.*/, '')
    })
  )

  callback(res.filter((item) => item))
}
</script>

<template>
  <MdEditor
    v-model="content"
    :theme
    :toolbars-exclude="['save', 'github']"
    :preview-theme
    @onUploadImg="handleUploadImg"
  />
</template>

<style lang="scss" scoped></style>

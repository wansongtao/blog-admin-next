<script lang="ts" setup>
import UploadIcon from '@/assets/svgs/icons/upload.svg'
import DeleteIcon from '@/assets/svgs/icons/delete.svg'

import { getPresignedUrl } from '@/api/common'
import { uploadFile } from '@/api/upload'

import type { UploadFileInfo } from 'naive-ui'

const coverImage = defineModel('value', { default: '' })
const uploadElement = useTemplateRef('uploadRef')

const uploadCover = async (file: File) => {
  const [, result] = await getPresignedUrl(file.name)
  if (!result) {
    window.$message.error('获取上传地址失败')
    return
  }

  // 改为相对路径，通过代理转发后上传
  let url = result.data.presignedUrl
  const origin = new URL(url).origin
  if (origin !== window.location.origin) {
    url = url.replace(origin, '')
  }

  const [error] = await uploadFile(url, file)
  if (error) {
    window.$message.error('上传封面失败')
    return
  }

  uploadElement.value?.clear()
  coverImage.value =
    window.location.origin + import.meta.env.VITE_MINIO_API + url.replace(/\?.*/, '')
}

const onRemove = () => {
  coverImage.value = ''
  uploadElement.value?.clear()
}

const verifyFileSize = (file: File, maxSize = 10 * 1024 * 1024) => {
  const isLt = file.size < maxSize
  if (!isLt) {
    return false
  }

  return true
}

const beforeUpload = (data: { file: UploadFileInfo }) => {
  const { file } = data
  const imgFile = file.file
  if (!imgFile) {
    return false
  }

  const isLt10M = verifyFileSize(imgFile)
  if (!isLt10M) {
    return false
  }

  uploadCover(imgFile)
  return false
}
</script>

<template>
  <n-upload
    ref="uploadRef"
    :max="1"
    accept="image/jpeg,image/png,image/jpg,image/gif"
    :show-file-list="false"
    :default-upload="false"
    @before-upload="beforeUpload"
  >
    <div class="upload-box upload-btn">
      <upload-icon v-show="!coverImage" />

      <img v-if="coverImage" class="cover" :src="coverImage" />
      <div v-if="coverImage" class="mask upload-box" @click.stop>
        <div class="delete-btn" @click="onRemove">
          <delete-icon />
        </div>
      </div>
    </div>
  </n-upload>
</template>

<style lang="scss" scoped>
.upload-box {
  width: 300px;
  height: 200px;
}

.upload-btn {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 48px;

  &:hover .mask {
    opacity: 1;
  }
}

.cover {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: default;

  .delete-btn {
    cursor: pointer;
  }
}
</style>

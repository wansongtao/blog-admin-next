<script lang="ts" setup>
import BaseEditor from './components/BaseEditor.vue'
import PopSelectTheme, { type IPreviewTheme } from './components/PopSelectTheme.vue'
import DrawerPublish, { type IForm } from './components/DrawerPublish.vue'
import { addArticle } from '@/api/article'

import type { ICreateArticleDto } from '@/types/api/article'

const show = ref(false)

const title = ref('')
const previewTheme = ref<IPreviewTheme>()
const content = ref('')
const disabledPublish = computed(() => {
  return !title.value || !content.value
})

const loading = ref(false)
const onSubmit = async (data: IForm) => {
  if (loading.value) return
  loading.value = true

  const params: ICreateArticleDto = {
    ...data,
    title: title.value,
    content: content.value,
    theme: previewTheme.value
  }

  const [, res] = await addArticle(params)
  loading.value = false
  if (!res) {
    return
  }

  show.value = false
  title.value = ''
  content.value = ''
  previewTheme.value = undefined
  window.$message?.success('文章发布成功')
}
</script>

<template>
  <base-box>
    <header class="header">
      <div class="header_item">
        <n-input
          v-model:value="title"
          type="text"
          size="large"
          placeholder="输入文章标题..."
          :bordered="false"
          :maxlength="150"
        />
      </div>
      <div class="header_item header_right">
        <n-button type="primary" :disabled="disabledPublish" @click="show = true">发布</n-button>
      </div>
    </header>
    <div class="main">
      <pop-select-theme v-model="previewTheme" />
      <base-editor v-model="content" :preview-theme />
    </div>

    <drawer-publish v-model:show="show" @submit="onSubmit" />
  </base-box>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;

  .header_item {
    flex: 1;
  }

  .header_right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.main {
  position: relative;
  flex: 1;

  :deep(.md-editor) {
    height: 100%;
  }
}
</style>

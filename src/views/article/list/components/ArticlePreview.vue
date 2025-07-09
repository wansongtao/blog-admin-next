<script lang="ts" setup>
import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import dayjs from 'dayjs'
import { useAppSetStore } from '@/stores/appSet'

import type { IArticleDetail } from '@/types/api/article'

defineProps<{
  article: IArticleDetail
}>()

const appSetStore = useAppSetStore()
const { theme } = storeToRefs(appSetStore)
</script>

<template>
  <base-box>
    <div class="content">
      <div class="title">{{ article.title }}</div>
      <div class="info">
        <div>
          <n-tag :type="article.published ? 'success' : 'info'" :bordered="false" size="tiny">
            {{ article.published ? '已发布' : '草稿' }}
          </n-tag>
        </div>
        <div>{{ article.author }}</div>
        <div>{{ dayjs(article.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </div>

      <div class="container">
        <div class="main-container">
          <MdPreview
            id="preview-only"
            :modelValue="article.content"
            :preview-theme="article.theme"
            :theme
          />
        </div>
        <div class="catalog-container">
          <MdCatalog editorId="preview-only" scrollElement=".content" :theme />
        </div>
      </div>
    </div>
  </base-box>
</template>

<style lang="scss" scoped>
.content {
  overflow-y: auto;
  max-height: 85vh;
}

.title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.info {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.container {
  display: flex;

  .main-container {
    flex: 1 1 0;
  }

  .catalog-container {
    margin-left: 10px;
    padding: 10px;
    border-left: 1px solid #ddd;
  }
}
</style>

<style lang="css">
.md-editor-dark,
.md-editor-modal-container[data-theme='dark'] {
  --md-bk-color: #2c2c31;
}
</style>

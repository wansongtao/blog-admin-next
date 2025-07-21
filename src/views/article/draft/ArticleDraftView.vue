<script lang="ts" setup>
import BaseEditor from './components/BaseEditor.vue'
import PopSelectTheme, { type IPreviewTheme } from './components/PopSelectTheme.vue'
import DrawerPublish, { type IForm } from './components/DrawerPublish.vue'
import { addArticle, updateArticle } from '@/api/article'
import { useArticleDetail } from './hooks/useArticleDetail'
import { encryptArticle, decryptArticle } from '@/plugins/encrypt'

import type { ICreateArticleDto } from '@/types/api/article'

const show = ref(false)

const title = ref('')
const previewTheme = ref<IPreviewTheme>()
const content = ref('')
const disabledPublish = computed(() => {
  return !title.value || !content.value
})

const { detail } = useArticleDetail()
const detailForm = computed(() => {
  if (!detail.value) {
    return undefined
  }

  const obj: IForm = {
    categoryId: detail.value.categoryId,
    visibility: detail.value.visibility,
    coverImage: detail.value.coverImage,
    featured: detail.value.featured,
    published: detail.value.published,
    summary: detail.value.summary,
    encrypted: detail.value.encrypted,
    passwordHint: detail.value.passwordHint
  }

  return obj
})
const showPasswordDialog = ref(false)
const decryptContent = (password: string) => {
  if (!detail.value) {
    return
  }

  const decryptedContent = decryptArticle(detail.value.content, password)
  if (!decryptedContent) {
    window.$message.error('解密失败，请检查密码提示')
    return
  }

  content.value = decryptedContent
  showPasswordDialog.value = false
}

watch(
  detail,
  (data) => {
    if (!data) {
      return
    }
    if (data.encrypted) {
      showPasswordDialog.value = true
    }

    title.value = data.title
    content.value = data.content
    previewTheme.value = data.theme as IPreviewTheme
  },
  { immediate: true }
)

const router = useRouter()
const loading = ref(false)

const editArticle = async (data: IForm, password?: string) => {
  if (!detail.value) {
    return
  }

  const params: Partial<ICreateArticleDto> = {
    ...data
  }
  if (previewTheme.value && previewTheme.value !== detail.value.theme) {
    params.theme = previewTheme.value
  }
  if (title.value && title.value !== detail.value.title) {
    params.title = title.value
  }
  if (content.value && content.value !== detail.value.content) {
    params.content = content.value
  }
  if (Object.keys(params).length === 0) {
    window.$message.warning('没有修改内容')
    loading.value = false
    return
  }

  if (data.encrypted && password) {
    params.content = encryptArticle(content.value, password)
    if (!params.content) {
      window.$message.error('加密失败，请检查密码提示')
      loading.value = false
      return
    }
  }

  const [, res] = await updateArticle(detail.value.id, params)
  loading.value = false
  if (!res) {
    return
  }
  window.$message.success('文章更新成功')
  show.value = false
  router.replace('/article/list')
}

const createArticle = async (data: IForm, password?: string) => {
  const params: ICreateArticleDto = {
    ...data,
    title: title.value,
    content: content.value,
    theme: previewTheme.value
  }

  if (data.encrypted && password) {
    params.content = encryptArticle(content.value, password)
    if (!params.content) {
      window.$message.error('加密失败，请检查密码提示')
      loading.value = false
      return
    }
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

const onSubmit = async (data: IForm, password?: string) => {
  if (loading.value) return
  loading.value = true

  if (detail.value) {
    await editArticle(data, password)
    return
  }

  await createArticle(data, password)
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

    <drawer-publish v-model:show="show" :detail="detailForm" @submit="onSubmit" />
    <article-password-dialog
      v-model:show="showPasswordDialog"
      :hint="detailForm?.passwordHint"
      @success="decryptContent"
    />
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

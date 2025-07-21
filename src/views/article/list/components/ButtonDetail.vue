<script lang="ts" setup>
import ArticlePreview from './ArticlePreview.vue'
import IconClose from '@/assets/svgs/icons/close.svg'

import { getArticleDetail } from '@/api/article'
import { decryptArticle } from '@/plugins/encrypt'

import type { IArticleDetail } from '@/types/api/article'

const { id } = defineProps<{ id: number }>()

const show = ref(false)
const loading = ref(false)
const detail = ref<IArticleDetail>()

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

  detail.value.content = decryptedContent
  showPasswordDialog.value = false
  show.value = true
}

const onOpen = async () => {
  loading.value = true
  const [, res] = await getArticleDetail(id)
  loading.value = false

  if (!res) {
    window.$message.error('获取文章详情失败')
    return
  }

  detail.value = res.data
  if (detail.value.encrypted) {
    showPasswordDialog.value = true
  } else {
    show.value = true
  }
}
</script>

<template>
  <div class="button-detail">
    <n-button type="info" ghost size="small" @click="onOpen">详情</n-button>

    <n-modal v-model:show="show" :auto-focus="false" display-directive="if">
      <div style="width: 90%; position: relative">
        <div class="close">
          <icon-close @click="show = false" />
        </div>
        <article-preview v-if="detail" :article="detail" />
      </div>
    </n-modal>

    <article-password-dialog
      v-model:show="showPasswordDialog"
      :hint="detail?.passwordHint"
      @success="decryptContent"
    />
  </div>
</template>

<style lang="scss" scoped>
.close {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 99;
  cursor: pointer;
  text-align: center;
  font-size: 24px;
}
</style>

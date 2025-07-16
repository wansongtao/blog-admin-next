<script lang="ts" setup>
import UploadCover from './UploadCover.vue'

import useFormValidate from '@/hooks/useFormValidate'
import useArticleVisibility from '@/hooks/useArticleVisibility'
import { getChangedData } from '@/utils'

import type { ICreateArticleDto } from '@/types/api/article'

export type IForm = Pick<
  ICreateArticleDto,
  'categoryId' | 'visibility' | 'coverImage' | 'featured' | 'summary' | 'published'
>

const { detail, loading } = defineProps<{
  detail?: IForm
  loading?: boolean
}>()
const $emits = defineEmits<{
  submit: [data: IForm]
  cancel: []
}>()
const show = defineModel<boolean>('show')

const { visibilityList } = useArticleVisibility()

const initFormData = (): IForm => {
  return {
    categoryId: 0,
    visibility: 'PRIVATE',
    coverImage: undefined,
    featured: false,
    published: false,
    summary: undefined
  }
}

watch([() => show, () => detail], ([val, detailData]) => {
  if (!val) {
    formData.value = initFormData()
  }

  if (val && detailData) {
    formData.value = {
      ...initFormData(),
      ...detailData
    }
  }
})

const formData = ref(initFormData())

const { formRef, validateForm } = useFormValidate()
const onSubmit = async () => {
  if (!(await validateForm())) {
    return
  }

  const data = detail ? getChangedData(formData.value, detail) : { ...formData.value }
  $emits('submit', data)
}

const onCancel = () => {
  show.value = false
  $emits('cancel')
}
</script>

<template>
  <n-drawer v-model:show="show" :width="502" placement="right" :z-index="10001">
    <n-drawer-content title="发布文章">
      <n-form ref="formRef" label-placement="left" label-width="100" :model="formData">
        <n-form-item
          label="分类"
          path="categoryId"
          :rule="{ required: true, message: '请选择分类' }"
        >
          <category-tree v-model="formData.categoryId" placeholder="请选择分类" />
        </n-form-item>
        <n-form-item label="文章可见性" path="visibility">
          <n-radio-group v-model:value="formData.visibility">
            <n-radio-button
              v-for="item in visibilityList"
              :value="item.value"
              :label="item.label"
            />
          </n-radio-group>
        </n-form-item>

        <n-form-item label="精选文章" path="featured">
          <n-switch v-model:value="formData.featured" />
        </n-form-item>

        <n-form-item label="发布状态" path="published">
          <n-switch v-model:value="formData.published" />
        </n-form-item>

        <n-form-item label="封面" path="coverImage">
          <upload-cover v-model:value="formData.coverImage" />
        </n-form-item>

        <n-form-item label="摘要" path="summary">
          <n-input
            v-model:value="formData.summary"
            type="textarea"
            placeholder="请输入文章摘要"
            clearable
            maxlength="200"
            show-count
          />
        </n-form-item>
        <n-form-item>
          <n-space style="width: 100%; justify-content: center">
            <n-button type="primary" :loading :disabled="!formData.categoryId" @click="onSubmit"
              >提交</n-button
            >
            <n-button :disabled="loading" @click="onCancel">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped></style>

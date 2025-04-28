<script lang="ts" setup>
import useFormValidate from '@/hooks/useFormValidate'
import { validateCategoryName, validateCategoryDescription } from '@/utils/validate'
import { getChangedData } from '@/utils'

import type { IRule } from '@/types'
import type { ICategoryParams } from '@/types/api/category'

const { detail, loading } = defineProps<{ detail?: ICategoryParams; loading?: boolean }>()
const $emits = defineEmits<{
  submit: [data: ICategoryParams]
  cancel: []
}>()

const initFormData = (): ICategoryParams => {
  return {
    pid: undefined,
    name: '',
    description: '',
    hidden: false,
    sort: 0
  }
}

const rules: IRule<ICategoryParams> = {
  name: { required: true, validator: validateCategoryName },
  description: { required: false, validator: validateCategoryDescription }
}

const formData = ref(initFormData())
watch(
  () => detail,
  (data) => {
    if (!data) {
      return
    }

    formData.value = { ...data }
  },
  { immediate: true }
)

const disabled = computed(() => {
  if (!formData.value.name) {
    return true
  }
  if (!detail) {
    return false
  }

  const changedData = getChangedData(formData.value, detail)
  return Object.keys(changedData).length === 0
})

const { formRef, validateForm } = useFormValidate()
const onSubmit = async () => {
  if (!(await validateForm())) {
    return
  }

  const data = detail ? getChangedData(formData.value, detail) : { ...formData.value }
  $emits('submit', data)
}

const onCancel = () => {
  $emits('cancel')
}
</script>

<template>
  <n-form ref="formRef" label-placement="left" label-width="100" :rules="rules" :model="formData">
    <n-form-item label="父分类" path="pid">
      <category-tree
        v-model="formData.pid"
        placeholder="请选择父分类"
        :disabled-name="detail?.name"
      />
    </n-form-item>
    <n-form-item label="名称" path="name">
      <n-input v-model:value="formData.name" placeholder="请输入名称" clearable />
    </n-form-item>

    <n-form-item path="sort">
      <template #label>
        <field-description label="排序权重" description="数字越大分类越靠前展示" />
      </template>
      <n-input-number v-model:value="formData.sort" :max="99" :min="0" :precision="0" />
    </n-form-item>

    <n-form-item path="hidden">
      <template #label>
        <field-description label="隐藏分类" description="隐藏后不会在博客前台展示这个分类" />
      </template>
      <n-switch v-model:value="formData.hidden" />
    </n-form-item>
    <n-form-item label="描述" path="description">
      <n-input
        v-model:value="formData.description"
        type="textarea"
        placeholder="请输入描述"
        clearable
        maxlength="150"
        show-count
      />
    </n-form-item>
    <n-form-item>
      <n-space style="width: 100%; justify-content: center">
        <n-button type="primary" :loading :disabled @click="onSubmit">提交</n-button>
        <n-button :disabled="loading" @click="onCancel">取消</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>

import type { FormInst } from 'naive-ui'

export default function useFormValidate() {
  const formRef = ref<FormInst | null>(null)

  const validateForm = () => {
    return new Promise<boolean>((resolve) => {
      formRef.value?.validate((valid) => {
        if (!valid) {
          resolve(true)
          return
        }

        resolve(false)
      })
    })
  }

  return {
    formRef,
    validateForm
  }
}

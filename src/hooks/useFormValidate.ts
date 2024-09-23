import type { FormInst } from 'naive-ui'

export default function useFormValidate(key = 'formRef') {
  const formRef = useTemplateRef<FormInst>(key)

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

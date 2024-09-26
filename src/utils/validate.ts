import type { FormItemRule } from 'naive-ui'

export const validateUsername = (_rule: any, value: string) => {
  if (!value) {
    return new Error('请输入用户名')
  }

  const regexp = /^[a-zA-Z][a-zA-Z0-9]{2,10}$/
  if (!regexp.test(value)) {
    return new Error('请输入3至11位由字母、数字组成的用户名(字母开头)')
  }

  return true
}

export const validatePassword = (_rule: any, value: string) => {
  if (!value) {
    return new Error('请输入密码')
  }

  const regexp = /^[a-zA-Z](?=.*[.?!&_])(?=.*\d)[a-zA-Z\d.?!&_]{5,15}$/
  if (!regexp.test(value)) {
    return new Error(
      '请输入6至16位由字母、数字、.?!&_特殊字符组成的密码(字母开头，必须包含字母、数字、特殊字符)'
    )
  }

  return true
}

export const validateMenuName = (_rule: any, value: string) => {
  const regexp = /^[a-zA-Z\u4e00-\u9fa5]{2,16}$/
  if (!regexp.test(value)) {
    return new Error('请输入2至16位由字母、汉字组成的菜单名称')
  }

  return true
}

export const validateMenuPermission = (rule: FormItemRule, value: string) => {
  if (!value && !rule.required) {
    return true
  }

  const regexp = /^[a-z:]{1,50}$/
  if (!regexp.test(value)) {
    return new Error('请输入1至50位由小写字母、:组成的权限标识')
  }

  return true
}

export const validateMenuPath = (rule: FormItemRule, value: string) => {
  if (!rule.required && !value) {
    return true
  }

  if (value.length > 50 || value.length < 2) {
    return new Error('请输入2至50位路由地址')
  }

  const regexp = /^\/?([a-zA-Z]+)(\/[a-zA-Z]+|\/:[a-zA-Z]+)*$/
  if (!regexp.test(value)) {
    return new Error('请输入由字母、‘/’、‘:’组成的路径')
  }

  return true
}

export const validateMenuComponent = (rule: FormItemRule, value: string) => {
  if (!rule.required && !value) {
    return true
  }

  if (value.length > 100 || value.length < 6) {
    return new Error('请输入6至100位组件路径')
  }

  const regexp = /^(\/[a-zA-Z]+[-_]?[a-zA-Z]+)+(.vue|.tsx|.jsx)$/
  if (!regexp.test(value)) {
    return new Error('请输入由字母、‘/’、‘-’、‘_’、‘.’组成的组件路径')
  }

  return true
}

export const validateMenuRedirect = (_rule: any, value: string) => {
  if (!value) {
    return true
  }

  if (value.length > 50 || value.length < 2) {
    return new Error('请输入2至50位由小写字母、数字、‘/’组成的重定向地址')
  }

  const regexp = /^(\/?[a-zA-Z0-9]+)+$/
  if (!regexp.test(value)) {
    return new Error('请输入2至50位由小写字母、数字、‘/’组成的重定向地址')
  }

  return true
}

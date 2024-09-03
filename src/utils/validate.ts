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

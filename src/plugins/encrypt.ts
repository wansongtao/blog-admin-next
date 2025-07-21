import CryptoJS from 'crypto-js'

/**
 * 加密文章内容
 * 使用 AES 对称加密算法和 PBKDF2 密钥派生函数
 */
export const encryptArticle = (content: string, password: string) => {
  // 生成随机盐值
  const salt = CryptoJS.lib.WordArray.random(128 / 8)

  // 使用 PBKDF2 派生密钥
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 5000
  })

  // 生成随机 IV
  const iv = CryptoJS.lib.WordArray.random(128 / 8)

  // 加密内容
  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // 组合盐值、IV 和加密内容
  const result = salt.toString() + iv.toString() + encrypted.toString()
  return result
}

/**
 * 解密文章内容
 * 使用 AES 对称加密算法和 PBKDF2 密钥派生函数
 */
export const decryptArticle = (encryptedData: string, password: string) => {
  try {
    // 提取盐值、IV 和加密内容
    const salt = CryptoJS.enc.Hex.parse(encryptedData.substring(0, 32))
    const iv = CryptoJS.enc.Hex.parse(encryptedData.substring(32, 64))
    const encrypted = encryptedData.substring(64)

    // 重新派生密钥
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 5000
    })

    // 解密
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    return null
  }
}

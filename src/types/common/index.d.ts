export interface ILoginParams {
  username: string
  password: string
  captcha: string
}

export interface IUserinfoData {
  /**
   * 用户头像
   */
  avatar: string
  /**
   * 用户昵称
   */
  nickName: string
  /**
   * 权限组
   */
  permissions: string[]
  roles: string[]
}

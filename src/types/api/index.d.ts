/**
 * 200 成功 | 400 参数错误 | 401 未登录 | 403 无权限 | 404 未找到 | 500 服务器错误
 */
export type ICode = 200 | 400 | 401 | 403 | 404 | 500

export interface IBaseResponse<T = unknown> {
  statusCode: ICode
  message: string
  data: T
}

export interface IConfigHeader {
  headers?: {
    isToken?: boolean
    isRepeat?: boolean
  }
}

import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { FormItemRule } from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApiInjection
  }
}

export interface IMenubarItem {
  label: string
  key: string
  hiddenCloseIcon?: boolean
  checked?: boolean
}

export type IMenuType = 'DIRECTORY' | 'MENU' | 'BUTTON'

export type IRule<T extends Record> = {
  [key in keyof T]: FormItemRule | FormItemRule[]
}

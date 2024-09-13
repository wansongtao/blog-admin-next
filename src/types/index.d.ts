import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

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

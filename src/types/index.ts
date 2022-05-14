import { ReactElement } from 'react'

export enum ACCOUNT_TYPE {
  PERSONAL = 'personal',
  BUSINESS = 'business',
}

export enum ATTACHMENT_TYPE {
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio',
  LINK = 'link',
}

export interface BottomActionSheetAction {
  text?: string
  renderText?: () => ReactElement
  icon?: string
  renderIcon: () => ReactElement
  onPress: () => void
}

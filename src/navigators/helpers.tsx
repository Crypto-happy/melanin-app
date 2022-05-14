import { CommonActions } from '@react-navigation/native'

export const showMenu = () => (state: any) => {
  // debugger
  return CommonActions.reset({
    ...state,
    menuVisible: true,
  })
}

export const hideMenu = () => (state: any) => {
  // debugger
  return CommonActions.reset({
    ...state,
    menuVisible: false,
  })
}

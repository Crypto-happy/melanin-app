import * as ActionTypes from './action-types'

export const setDynamicLink = (options: any) => ({
  type: ActionTypes.SET_DYNAMIC_LINK,
  payload: options,
  showLoading: false,
})

import * as ActionTypes from './action-types'

export const showLoadingIndicator = () => ({
  type: ActionTypes.SHOW_LOADING_INDICATOR,
})

export const hideLoadingIndicator = () => ({
  type: ActionTypes.HIDE_LOADING_INDICATOR,
})

export const increaseLoadingRequest = () => ({
  type: ActionTypes.INCREASE_LOADING_REQUEST,
})

export const decreaseLoadingRequest = () => ({
  type: ActionTypes.DECREASE_LOADING_REQUEST,
})

import * as ActionTypes from './action-types'

export const resetPasswordRequest = (password: string, accessToken) => ({
  type: ActionTypes.RESET_PASSWORD_REQUEST,
  payload: {
    password,
    accessToken,
  },
  showLoading: true,
})

export const resetPasswordSuccess = () => ({
  type: ActionTypes.RESET_PASSWORD_SUCCESS,
  showLoading: false,
})

export const resetPasswordFailure = (error: string) => ({
  type: ActionTypes.RESET_PASSWORD_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const resetAll = () => ({
  type: ActionTypes.RESET_ALL,
})

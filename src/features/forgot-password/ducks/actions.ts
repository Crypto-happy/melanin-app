import * as ActionTypes from './action-types'

export const forgotPasswordRequest = (email: string) => ({
  type: ActionTypes.FORGOT_PASSWORD_REQUEST,
  payload: {
    email,
  },
  showLoading: true,
})

export const forgotPasswordSuccess = (result: any) => ({
  type: ActionTypes.FORGOT_PASSWORD_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const forgotPasswordFailure = (error: string) => ({
  type: ActionTypes.FORGOT_PASSWORD_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

import * as ActionTypes from './action-types'

export const changePasswordRequest = (newPassword: string, oldPassword: string) => ({
  type: ActionTypes.CHANGE_PASSWORD_REQUEST,
  payload: {
    newPassword,
    oldPassword,
  },
  showLoading: true,
})

export const changePasswordSuccess = (result: any) => ({
  type: ActionTypes.CHANGE_PASSWORD_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const changePasswordFailure = (error: string) => ({
  type: ActionTypes.CHANGE_PASSWORD_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

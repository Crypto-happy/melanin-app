import * as ActionTypes from './action-types'

export const logoutRequest = () => ({
  type: ActionTypes.LOGOUT_REQUEST,
  showLoading: true,
})

export const logoutSuccess = (result: any) => ({
  type: ActionTypes.LOGOUT_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const logoutFailure = (error: any) => ({
  type: ActionTypes.LOGOUT_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const getUserSettingRequest = () => ({
  type: ActionTypes.GET_USER_SETTING_REQUEST,
  showLoading: true,
})

export const getUserSettingSuccess = (result: any, siteUrlsResult: any) => ({
  type: ActionTypes.GET_USER_SETTING_SUCCESS,
  payload: {
    result,
    siteUrlsResult,
  },
  showLoading: false,
})

export const getUserSettingFailure = (error: any) => ({
  type: ActionTypes.GET_USER_SETTING_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const updateUserSettingRequest = (settingObj: object) => ({
  type: ActionTypes.UPDATE_USER_SETTING_REQUEST,
  payload: {
    settingObj,
  },
  showLoading: true,
})

export const updateUserSettingSuccess = (result: any) => ({
  type: ActionTypes.UPDATE_USER_SETTING_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const updateUserSettingFailure = (error: any) => ({
  type: ActionTypes.UPDATE_USER_SETTING_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const getBlockedUserRequest = () => ({
  type: ActionTypes.GET_BLOCKED_USER_REQUEST,
  showLoading: true,
})

export const blockedUserSuccess = (result: any) => ({
  type: ActionTypes.GET_BLOCKED_USER_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const blockedUserFailure = (error: any) => ({
  type: ActionTypes.GET_BLOCKED_USER_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

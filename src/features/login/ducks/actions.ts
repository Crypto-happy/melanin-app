import * as ActionTypes from './action-types'

export const loginRequest = (email: string, password: string) => ({
  type: ActionTypes.LOGIN_REQUEST,
  payload: {
    email,
    password,
  },
  showLoading: true,
})

export const loginSuccess = (result: any) => ({
  type: ActionTypes.LOGIN_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const loginFailure = (error: string) => ({
  type: ActionTypes.LOGIN_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const loginFacebookRequest = (userId: string, accessToken: string) => ({
  type: ActionTypes.LOGIN_FACEBOOK_REQUEST,
  payload: {
    userId,
    accessToken,
  },
  showLoading: true,
})

export const loginFacebookSuccess = (result: any) => ({
  type: ActionTypes.LOGIN_FACEBOOK_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const loginFacebookFailure = (error: string) => ({
  type: ActionTypes.LOGIN_FACEBOOK_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const loginAppleIdRequest = (appleAuth: any) => ({
  type: ActionTypes.LOGIN_APPLE_ID_REQUEST,
  payload: {
    appleAuth,
  },
  showLoading: true,
})

export const loginAppleIdSuccess = (result: any) => ({
  type: ActionTypes.LOGIN_APPLE_ID_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const loginAppleIdFailure = (error: string) => ({
  type: ActionTypes.LOGIN_APPLE_ID_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

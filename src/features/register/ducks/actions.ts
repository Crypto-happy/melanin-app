import * as ActionTypes from './action-types'

export const registerAccountRequest = (data: any) => ({
  type: ActionTypes.REGISTER_ACCOUNT_REQUEST,
  payload: data,
  showLoading: true,
})

export const registerAccountSuccess = (result: any) => ({
  type: ActionTypes.REGISTER_ACCOUNT_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const registerAccountFailure = (error: any) => ({
  type: ActionTypes.REGISTER_ACCOUNT_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const getSiteUrlsRequest = () => ({
  type: ActionTypes.SITE_URLS_REQUEST,
  showLoading: true,
})

export const getSiteUrlsSuccess = (result: any) => ({
  type: ActionTypes.SITE_URLS_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const getSiteUrlsFailure = (error: any) => ({
  type: ActionTypes.SITE_URLS_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

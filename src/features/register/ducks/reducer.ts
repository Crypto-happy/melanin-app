import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'
import createReducer from '../../../utils/createReducer'

const initialState = {
  requesting: false,
  success: false,
  error: null,
  siteUrls: {},
}

const handleRegisterRequest = (state: any, action: any) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleRegisterSuccess = (state: any, action: any) => {
  return update(state, {
    requesting: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleRegisterFailure = (state: any, action: any) => {
  const errorMessage = get(action, 'payload.error.message', null)

  return update(state, {
    requesting: { $set: false },
    success: { $set: false },
    error: { $set: errorMessage },
  })
}

const handleSiteUrlsRequest = (state: any, action: any) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleSiteUrlsSuccess = (state: any, action: any) => {
  return update(state, {
    requesting: { $set: false },
    error: { $set: null },
    siteUrls: { $set: action.payload.result },
  })
}

const registerReducer = createReducer(initialState, {
  [ActionTypes.REGISTER_ACCOUNT_REQUEST]: handleRegisterRequest,
  [ActionTypes.REGISTER_ACCOUNT_SUCCESS]: handleRegisterSuccess,
  [ActionTypes.REGISTER_ACCOUNT_FAILURE]: handleRegisterFailure,

  [ActionTypes.SITE_URLS_REQUEST]: handleSiteUrlsRequest,
  [ActionTypes.SITE_URLS_SUCCESS]: handleSiteUrlsSuccess,
})

export default registerReducer

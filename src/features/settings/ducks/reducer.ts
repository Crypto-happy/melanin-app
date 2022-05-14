import createReducer from '../../../utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  loading: false,
  success: false,
  error: null,
  settingData: null,
  siteUrls: null,
  blockedUser: [],
}

const handleLogoutRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleLogoutSuccess = (state, action) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleLogoutFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleUserSettingRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleUserSettingSuccess = (state, action) => {
  const data = action.payload.result.data
  const siteUrlsData = action.payload.siteUrlsResult.data

  return update(state, {
    loading: { $set: false },
    settingData: { $set: data },
    siteUrls: { $set: siteUrlsData },
    error: { $set: null },
  })
}

const handleUserSettingFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleBlockedUserRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleBlockedUserSuccess = (state, action) => {
  const data = action.payload.result.data

  return update(state, {
    loading: { $set: false },
    blockedUser: { $set: data },
    error: { $set: null },
  })
}

const handleBlockedUserFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const settingsReducer = createReducer(initialState, {
  [ActionTypes.LOGOUT_REQUEST]: handleLogoutRequest,
  [ActionTypes.LOGOUT_SUCCESS]: handleLogoutSuccess,
  [ActionTypes.LOGOUT_FAILURE]: handleLogoutFailure,

  [ActionTypes.GET_USER_SETTING_REQUEST]: handleUserSettingRequest,
  [ActionTypes.GET_USER_SETTING_SUCCESS]: handleUserSettingSuccess,
  [ActionTypes.GET_USER_SETTING_FAILURE]: handleUserSettingFailure,

  [ActionTypes.GET_BLOCKED_USER_REQUEST]: handleBlockedUserRequest,
  [ActionTypes.GET_BLOCKED_USER_SUCCESS]: handleBlockedUserSuccess,
  [ActionTypes.GET_BLOCKED_USER_FAILURE]: handleBlockedUserFailure,
})

export default settingsReducer

import createReducer from '../../../utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'

const initialState = {
  requesting: false,
  success: false,
  error: null,
  fbUser: null,
  appleUser: null,
}

const handleLoginRequest = (state, action) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleLoginSuccess = (state, action) => {
  return update(state, {
    requesting: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleLoginFailure = (state, action) => {
  const errorMessage = get(action, 'payload.error.message', null)

  return update(state, {
    requesting: { $set: false },
    success: { $set: false },
    error: { $set: errorMessage },
  })
}

const handleLoginFacebookRequest = (state, action) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
    fbUser: { $set: null },
  })
}

const handleLoginFacebookSuccess = (state, action) => {
  return update(state, {
    requesting: { $set: false },
    success: { $set: true },
    error: { $set: null },
    fbUser: { $set: action.payload.result },
  })
}

const handleLoginFacebookFailure = (state, action) => {
  const errorMessage = get(action, 'payload.error.message', null)

  return update(state, {
    requesting: { $set: false },
    success: { $set: false },
    error: { $set: errorMessage },
  })
}

const handleLoginAppleIdRequest = (state, action) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
    appleUser: { $set: null },
  })
}

const handleLoginAppleIdSuccess = (state, action) => {
  return update(state, {
    requesting: { $set: false },
    success: { $set: true },
    error: { $set: null },
    appleUser: { $set: action.payload.result },
  })
}

const handleLoginAppleIdFailure = (state, action) => {
  const errorMessage = get(action, 'payload.error.message', null)

  return update(state, {
    requesting: { $set: false },
    success: { $set: false },
    error: { $set: errorMessage },
  })
}

const loginReducer = createReducer(initialState, {
  [ActionTypes.LOGIN_REQUEST]: handleLoginRequest,
  [ActionTypes.LOGIN_SUCCESS]: handleLoginSuccess,
  [ActionTypes.LOGIN_FAILURE]: handleLoginFailure,

  [ActionTypes.LOGIN_FACEBOOK_REQUEST]: handleLoginFacebookRequest,
  [ActionTypes.LOGIN_FACEBOOK_SUCCESS]: handleLoginFacebookSuccess,
  [ActionTypes.LOGIN_FACEBOOK_FAILURE]: handleLoginFacebookFailure,

  [ActionTypes.LOGIN_APPLE_ID_REQUEST]: handleLoginAppleIdRequest,
  [ActionTypes.LOGIN_APPLE_ID_SUCCESS]: handleLoginAppleIdSuccess,
  [ActionTypes.LOGIN_APPLE_ID_FAILURE]: handleLoginAppleIdFailure,
})

export default loginReducer

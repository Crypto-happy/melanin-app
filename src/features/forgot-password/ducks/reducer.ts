import createReducer from '../../../utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'

const initialState = {
  requesting: false,
  success: false,
  error: null,
}

const handleForgotPasswordRequest = (state, action) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleForgotPasswordSuccess = (state, action) => {
  return update(state, {
    requesting: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleForgotPasswordFailure = (state, action) => {
  const errorMessage = get(action, 'payload.error.message', null)

  return update(state, {
    requesting: { $set: false },
    success: { $set: false },
    error: { $set: errorMessage },
  })
}

const forgotPasswordReducer = createReducer(initialState, {
  [ActionTypes.FORGOT_PASSWORD_REQUEST]: handleForgotPasswordRequest,
  [ActionTypes.FORGOT_PASSWORD_SUCCESS]: handleForgotPasswordSuccess,
  [ActionTypes.FORGOT_PASSWORD_FAILURE]: handleForgotPasswordFailure,
})

export default forgotPasswordReducer

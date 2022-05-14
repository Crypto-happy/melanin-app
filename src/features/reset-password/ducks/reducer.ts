import createReducer from '../../../utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'

const initialState = {
  requesting: false,
  success: false,
  error: null,
}

const handleResetPasswordRequest = (state, action) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleResetPasswordSuccess = (state, action) => {
  return update(state, {
    requesting: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleResetPasswordFailure = (state, action) => {
  const errorMessage = get(action, 'payload.error.message', null)

  return update(state, {
    requesting: { $set: false },
    success: { $set: false },
    error: { $set: errorMessage },
  })
}

const handleResetAll = (state: any, action: any) => {
  return initialState
}

const resetPasswordReducer = createReducer(initialState, {
  [ActionTypes.RESET_PASSWORD_REQUEST]: handleResetPasswordRequest,
  [ActionTypes.RESET_PASSWORD_SUCCESS]: handleResetPasswordSuccess,
  [ActionTypes.RESET_PASSWORD_FAILURE]: handleResetPasswordFailure,
  [ActionTypes.RESET_ALL]: handleResetAll,
})

export default resetPasswordReducer

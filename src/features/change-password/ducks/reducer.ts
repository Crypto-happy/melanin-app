import createReducer from '../../../utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'

const initialState = {
  requesting: false,
  success: false,
  error: null,
}

const handleChangePasswordRequest = (state, action) => {
  return update(state, {
    requesting: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleChangePasswordSuccess = (state, action) => {
  return update(state, {
    requesting: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleChangePasswordFailure = (state, action) => {
  const errorMessage = get(action, 'payload.error.message', null)

  return update(state, {
    requesting: { $set: false },
    success: { $set: false },
    error: { $set: errorMessage },
  })
}

const changePasswordReducer = createReducer(initialState, {
  [ActionTypes.CHANGE_PASSWORD_REQUEST]: handleChangePasswordRequest,
  [ActionTypes.CHANGE_PASSWORD_SUCCESS]: handleChangePasswordSuccess,
  [ActionTypes.CHANGE_PASSWORD_FAILURE]: handleChangePasswordFailure,
})

export default changePasswordReducer

import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  notifications:[],
  loading: false,
  error: null,
}

const handleGetNotificationsRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleGetNotificationsSuccess = (state: any, action: any) => {
  return update(state, {
    notifications: { $set: action.payload.result },
    loading: { $set: false },
    error: { $set: null },
  })
}

const handleGetNotificationsFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleSeenNotificationsSuccess = (state: any, action: any) => {
  return update(state, {
    notifications: { $set: action.payload.result },
    loading: { $set: false },
    error: { $set: null },
  })
}

const reducer = createReducer(initialState, {
  [ActionTypes.GET_NOTIFICATIONS_REQUEST]: handleGetNotificationsRequest,
  [ActionTypes.GET_NOTIFICATIONS_SUCCESS]: handleGetNotificationsSuccess,
  [ActionTypes.GET_NOTIFICATIONS_FAILURE]: handleGetNotificationsFailure,
  [ActionTypes.SEEN_NOTIFICATIONS_SUCCESS]: handleSeenNotificationsSuccess,
})

export default reducer

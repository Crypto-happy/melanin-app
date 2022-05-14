import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  loading: false,
  success: false,
  error: null,
  topics: [],
}

const handleGetTopicsRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleGetTopicsSuccess = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: null },
    topics: { $set: action.payload.result },
  })
}

const handleGetTopicsFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const followTopicsReducer = createReducer(initialState, {
  [ActionTypes.GET_TOPICS_REQUEST]: handleGetTopicsRequest,
  [ActionTypes.GET_TOPICS_SUCCESS]: handleGetTopicsSuccess,
  [ActionTypes.GET_TOPICS_FAILURE]: handleGetTopicsFailure,
})

export default followTopicsReducer

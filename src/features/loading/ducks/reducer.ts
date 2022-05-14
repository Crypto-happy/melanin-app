import createReducer from '../../../utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  requestCount: 0,
  visible: false,
}

const handleShowLoadingIndicator = (state, action) => {
  return update(state, {
    visible: { $set: true },
  })
}

const handleHideLoadingIndicator = (state, action) => {
  return update(state, {
    visible: { $set: false },
  })
}

const handleIncreaseLoadingRequest = (state, action) => {
  return update(state, {
    requestCount: {
      $apply: (count) => ++count,
    },
  })
}

const handleDecreaseLoadingRequest = (state, action) => {
  return update(state, {
    requestCount: {
      $apply: (count) => --count,
    },
  })
}

const loadingReducer = createReducer(initialState, {
  [ActionTypes.SHOW_LOADING_INDICATOR]: handleShowLoadingIndicator,
  [ActionTypes.HIDE_LOADING_INDICATOR]: handleHideLoadingIndicator,
  [ActionTypes.INCREASE_LOADING_REQUEST]: handleIncreaseLoadingRequest,
  [ActionTypes.DECREASE_LOADING_REQUEST]: handleDecreaseLoadingRequest,
})

export default loadingReducer

import createReducer from '../../../utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  loading: false,
  success: false,
  error: null,
}

const handleReportPostRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleReportPostSuccess = (state, action) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleReportPostFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

export const reportPostReducer = createReducer(initialState, {
  [ActionTypes.REPORT_POST_REQUEST]: handleReportPostRequest,
  [ActionTypes.REPORT_POST_SUCCESS]: handleReportPostSuccess,
  [ActionTypes.REPORT_POST_FAILURE]: handleReportPostFailure,
})

export default reportPostReducer

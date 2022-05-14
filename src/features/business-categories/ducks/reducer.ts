import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  loading: false,
  error: null,
}

const handleGetBusinessCategoriesRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleGetBusinessCategoriesSuccess = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: null },
  })
}

const handleGetBusinessCategoriesFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const reducer = createReducer(initialState, {
  [ActionTypes.GET_BUSINESS_CATEGORIES_REQUEST]: handleGetBusinessCategoriesRequest,
  [ActionTypes.GET_BUSINESS_CATEGORIES_SUCCESS]: handleGetBusinessCategoriesSuccess,
  [ActionTypes.GET_BUSINESS_CATEGORIES_FAILURE]: handleGetBusinessCategoriesFailure,
})

export default reducer

import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'

const initialState = {
  loading: false,
  success: false,
  error: false,
  p_categories: [],
}

const handleCategoriesSuccess = (state: any, action: any) => {
  const Categories = get(action, 'payload.results', {})

  return update(state, {
    p_categories: { $push: Categories },
  })
}

const handleSubmitPostRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: false },
  })
}

const handleSubmitPostSuccess = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
  })
}

const handleSubmitPostFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const newPostReducer = createReducer(initialState, {
  [ActionTypes.CATEGORIES_SUCCESS]: handleCategoriesSuccess,

  [ActionTypes.SUBMIT_POST_REQUEST]: handleSubmitPostRequest,
  [ActionTypes.SUBMIT_POST_SUCCESS]: handleSubmitPostSuccess,
  [ActionTypes.SUBMIT_POST_FAILURE]: handleSubmitPostFailure,

  [ActionTypes.UPDATE_POST_REQUEST]: handleSubmitPostRequest,
  [ActionTypes.UPDATE_POST_SUCCESS]: handleSubmitPostSuccess,
  [ActionTypes.UPDATE_POST_FAILURE]: handleSubmitPostFailure,
})

export default newPostReducer

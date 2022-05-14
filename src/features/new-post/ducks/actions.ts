import * as ActionTypes from './action-types'

export const submitPostRequest = (
  post: any,
  uploadProgressHandler: (event: ProgressEvent) => void,
) => ({
  type: ActionTypes.SUBMIT_POST_REQUEST,
  payload: { post, uploadProgressHandler },
})

export const submitPostSuccess = (result: any) => ({
  type: ActionTypes.SUBMIT_POST_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const submitPostFailure = (error: any) => ({
  type: ActionTypes.SUBMIT_POST_FAILURE,
  payload: {
    error,
  },
})

export const updatePostRequest = (
  post: any,
  uploadProgressHandler: (event: ProgressEvent) => void,
) => ({
  type: ActionTypes.UPDATE_POST_REQUEST,
  payload: { post, uploadProgressHandler },
})

export const updatePostSuccess = (result: any) => ({
  type: ActionTypes.UPDATE_POST_SUCCESS,
  payload: {
    result,
  },
  // showLoading: false,
})

export const updatePostFailure = (error: any) => ({
  type: ActionTypes.UPDATE_POST_FAILURE,
  payload: {
    error,
  },
})

export const product_categories = () => ({
  type: ActionTypes.CATEGORIES,
})

export const product_categories_success = (results: any) => ({
  type: ActionTypes.CATEGORIES_SUCCESS,
  payload: { results },
})

export const product_categories_failure = (error: any) => ({
  type: ActionTypes.CATEGORIES_FAILURE,
  payload: { error },
})

import * as ActionTypes from './action-types'

export const getReviewsRequest = (
  targetId: string = '',
  skip: number,
  limit: number,
) => ({
  type: ActionTypes.GET_REVIEWS_REQUEST,
  payload: { targetId, skip, limit },
  showLoading: true,
})

export const getReviewsSuccess = (result: any) => ({
  type: ActionTypes.GET_REVIEWS_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getReviewsFailure = (error: any) => ({
  type: ActionTypes.GET_REVIEWS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const addNewReviewRequest = (
  targetId: string = '',
  text: string = '',
  rating: number = 5,
) => ({
  type: ActionTypes.ADD_NEW_REVIEW_REQUEST,
  payload: { targetId, text, rating },
  showLoading: true,
})

export const addNewReviewSuccess = (result: any, userId?: string) => ({
  type: ActionTypes.ADD_NEW_REVIEW_SUCCESS,
  payload: { result, userId },
  showLoading: false,
})

export const addNewReviewFailure = (error: any) => ({
  type: ActionTypes.ADD_NEW_REVIEW_FAILURE,
  payload: { error },
  showLoading: false,
})

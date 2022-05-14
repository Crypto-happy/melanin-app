import * as ActionTypes from './action-types'

export const getProfileRequest = () => ({
  type: ActionTypes.GET_PROFILE_REQUEST,
  payload: {},
  showLoading: true,
})

export const getProfileSuccess = (result: any) => ({
  type: ActionTypes.GET_PROFILE_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getProfileFailure = (error: any) => ({
  type: ActionTypes.GET_PROFILE_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getPostsByAuthorIdRequest = (
  userId: string,
  skip: number,
  limit: number,
) => ({
  type: ActionTypes.GET_POSTS_BY_AUTHOR_ID_REQUEST,
  payload: { userId, skip, limit },
  showLoading: true,
})

export const getPostsByAuthorIdSuccess = (result: any) => ({
  type: ActionTypes.GET_POSTS_BY_AUTHOR_ID_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getPostsByAuthorIdFailure = (error: any) => ({
  type: ActionTypes.GET_POSTS_BY_AUTHOR_ID_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getProfileRatingPostRequest = (userId: string) => ({
  type: ActionTypes.GET_PROFILE_RATING_POSTS_REQUEST,
  payload: { userId },
  showLoading: true,
})

export const getProfileRatingPostSuccess = (result: any) => ({
  type: ActionTypes.GET_PROFILE_RATING_POSTS_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getProfileRatingPostFailure = (error: any) => ({
  type: ActionTypes.GET_PROFILE_RATING_POSTS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getAllCategoryRequest = () => ({
  type: ActionTypes.PROFILE_GET_ALL_CATEGORY_REQUEST,
  showLoading: true,
})

export const getAllCategorySuccess = (results: any) => ({
  type: ActionTypes.PROFILE_GET_ALL_CATEGORY_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const getAllCategoryFailure = (error: any) => ({
  type: ActionTypes.PROFILE_GET_ALL_CATEGORY_FAILURE,
  payload: { error },
  showLoading: false,
})

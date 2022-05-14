import * as ActionTypes from './action-types'

export const getUserProfileRequest = (userId: string = '') => ({
  type: ActionTypes.GET_PUBLIC_USER_PROFILE_REQUEST,
  payload: { userId },
  showLoading: true,
})

export const getUserProfileSuccess = (result: any) => ({
  type: ActionTypes.GET_PUBLIC_USER_PROFILE_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getUserProfileFailure = (userId: string, error: any) => ({
  type: ActionTypes.GET_PUBLIC_USER_PROFILE_FAILURE,
  payload: { error, userId },
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

export const getPostsByAuthorIdSuccess = (result: any, userId: string) => ({
  type: ActionTypes.GET_POSTS_BY_AUTHOR_ID_SUCCESS,
  payload: { result, userId },
  showLoading: false,
})

export const getPostsByAuthorIdFailure = (error: any, userId: string) => ({
  type: ActionTypes.GET_POSTS_BY_AUTHOR_ID_FAILURE,
  payload: { error, userId },
  showLoading: false,
})

export const followUserRequest = (userId: string) => ({
  type: ActionTypes.FOLLOW_USER_BY_ID_REQUEST,
  payload: { userId },
  showLoading: true,
})

export const followUserSuccess = (result: any) => ({
  type: ActionTypes.FOLLOW_USER_BY_ID_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const followUserFailure = (error: any) => ({
  type: ActionTypes.FOLLOW_USER_BY_ID_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getUserProfileRatingPostRequest = (userId: string) => ({
  type: ActionTypes.GET_USER_PROFILE_RATING_POSTS_REQUEST,
  payload: { userId },
  showLoading: true,
})

export const getUserProfileRatingPostSuccess = (result: any) => ({
  type: ActionTypes.GET_USER_PROFILE_RATING_POSTS_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getUserProfileRatingPostFailure = (
  userId: string,
  error: any,
) => ({
  type: ActionTypes.GET_USER_PROFILE_RATING_POSTS_FAILURE,
  payload: { userId, error },
  showLoading: false,
})

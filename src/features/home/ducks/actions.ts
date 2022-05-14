import * as ActionTypes from './action-types'

export const getPostsRequest = (skip: number, limit: number) => ({
  type: ActionTypes.GET_POSTS_REQUEST,
  payload: {
    skip,
    limit,
  },
  showLoading: true,
})

export const getPostsSuccess = (result: any) => ({
  type: ActionTypes.GET_POSTS_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getPostsFailure = (error: any) => ({
  type: ActionTypes.GET_POSTS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const likePostRequest = (id: string) => ({
  type: ActionTypes.LIKE_POST_REQUEST,
  payload: { id },
})

export const likePostSuccess = (result: any) => ({
  type: ActionTypes.LIKE_POST_SUCCESS,
  payload: { result },
})

export const likePostFailure = (error: any) => ({
  type: ActionTypes.LIKE_POST_FAILURE,
  payload: { error },
})

export const dislikePostRequest = (id: string) => ({
  type: ActionTypes.DISLIKE_POST_REQUEST,
  payload: { id },
})

export const dislikePostSuccess = (result: any) => ({
  type: ActionTypes.DISLIKE_POST_SUCCESS,
  payload: { result },
})

export const dislikePostFailure = (error: any) => ({
  type: ActionTypes.DISLIKE_POST_FAILURE,
  payload: { error },
})

export const ratePostRequest = (id: string, rating: number) => ({
  type: ActionTypes.RATE_POST_REQUEST,
  payload: { id, rating },
})

export const ratePostSuccess = (result: any) => ({
  type: ActionTypes.RATE_POST_SUCCESS,
  payload: { result },
})

export const ratePostFailure = (error: any) => ({
  type: ActionTypes.RATE_POST_FAILURE,
  payload: { error },
})

export const deletePostRequest = (id: string) => ({
  type: ActionTypes.DELETE_POST_REQUEST,
  payload: { id },
  // showLoading: true,
})

export const deletePostSuccess = (result: any, id: string = '') => ({
  type: ActionTypes.DELETE_POST_SUCCESS,
  payload: { result, id },
  // showLoading: false,
})

export const deletePostFailure = (error: any) => ({
  type: ActionTypes.DELETE_POST_FAILURE,
  payload: { error },
  // showLoading: false,
})

export const blockUserRequest = (id: string) => ({
  type: ActionTypes.BLOCK_USER_REQUEST,
  payload: { id },
  // showLoading: true,
})

export const blockUserSuccess = (result: any) => ({
  type: ActionTypes.BLOCK_USER_SUCCESS,
  payload: { result },
  // showLoading: false,
})

export const blockUserFailure = (error: any) => ({
  type: ActionTypes.BLOCK_USER_FAILURE,
  payload: { error },
  showLoading: false,
})

import * as ActionTypes from './action-types'

export const getFollowersRequest = (userId: string) => ({
  type: ActionTypes.GET_FOLLOWERS_REQUEST,
  payload: { userId },
  showLoading: true,
})

export const getFollowersSuccess = (results: any) => ({
  type: ActionTypes.GET_FOLLOWERS_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const getFollowersFailure = (error: any) => ({
  type: ActionTypes.GET_FOLLOWERS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getFollowingsRequest = (userId: string) => ({
  type: ActionTypes.GET_FOLLOWINGS_REQUEST,
  payload: { userId },
  showLoading: true,
})

export const getFollowingsSuccess = (results: any) => ({
  type: ActionTypes.GET_FOLLOWINGS_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const getFollowingsFailure = (error: any) => ({
  type: ActionTypes.GET_FOLLOWINGS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const resetFollowerFollowing = () => ({
  type: ActionTypes.RESET_FOLLOWER_FOLLOWING,
  showLoading: false,
})

export const followUser = (userId: string) => ({
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

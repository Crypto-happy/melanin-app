import { get } from 'lodash'

import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants/index'
import { LOGOUT_SUCCESS } from 'features/settings/ducks/action-types'
import { FOLLOW_USER_BY_ID_SUCCESS } from 'features/followers-following/ducks/action-types'
import { DELETE_POST_SUCCESS } from 'features/home/ducks/action-types'

const initialState = {
  postIds: [],
  posts: [],
  userInfo: {},
  followingsCount: 0,
  followersCount: 0,
  postsCount: 0,
  reviewsCount: 0,
  ratingTotalPosts: 0,
  ratingTotalPoints: 0,
  pagination: {
    skip: 0,
    endReached: false,
  },
  loading: false,
  error: null,
  allCategory: [],
}

const handleGetProfileRequest = (state) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleGetProfileSuccess = (state, action) => {
  const followingsCount = get(action, 'payload.result.followingsCount', 0)
  const followersCount = get(action, 'payload.result.followersCount', 0)
  const postsCount = get(action, 'payload.result.postsCount', 0)
  const reviewsCount = get(action, 'payload.result.reviewsCount', 0)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    userInfo: { $set: action.payload.result },
    followingsCount: { $set: followingsCount },
    followersCount: { $set: followersCount },
    postsCount: { $set: postsCount },
    reviewsCount: { $set: reviewsCount },
  })
}

const handleGetProfileRatingPostsSuccess = (state, action) => {
  const ratingTotalPosts = get(action, 'payload.result.totalPosts', 0)
  const ratingTotalPoints = get(action, 'payload.result.totalPoints', 0)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    ratingTotalPosts: { $set: ratingTotalPosts },
    ratingTotalPoints: { $set: ratingTotalPoints },
  })
}

const handleGetProfileFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleGetPostsAuthorRequest = (state, action) => {
  const { skip } = action.payload

  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleGetPostsAuthorSuccess = (state, action) => {
  const ids = action.payload.result.map((post: any) => post.id)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    postIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}

const handleGetPostsAuthorFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleFollowUserSuccess = (state, action) => {
  const user = action.payload.result.user
  return update(state, {
    userInfo: { followings: { $set: user.followings } },
    followingsCount: { $set: user.followings.length },
  })
}

const handleGetAllCategoryRequest = (state: any) => {
  return state
}

const handleGetAllCategorySuccess = (state: any, action: any) => {
  const allCategory = get(action, 'payload.results', {})
  return update(state, {
    allCategory: { $set: allCategory },
  })
}

const handleGetAllCategoryFailure = (state: any) => {
  return update(state, {
    allCategory: { $set: {} },
  })
}

const handleLogoutSuccess = () => {
  return initialState
}

const handleDeletePostSuccess = (state: any, action: any) => {
  const { postIds = [] } = state

  return update(state, {
    postIds: {
      $set: postIds.filter((id: string) => id !== action.payload.id),
    },
  })
}

const profileReducer = createReducer(initialState, {
  [ActionTypes.GET_PROFILE_REQUEST]: handleGetProfileRequest,
  [ActionTypes.GET_PROFILE_SUCCESS]: handleGetProfileSuccess,
  [ActionTypes.GET_PROFILE_FAILURE]: handleGetProfileFailure,
  [ActionTypes.GET_PROFILE_RATING_POSTS_REQUEST]: handleGetProfileRequest,
  [ActionTypes.GET_PROFILE_RATING_POSTS_SUCCESS]:
    handleGetProfileRatingPostsSuccess,
  [ActionTypes.GET_PROFILE_RATING_POSTS_FAILURE]: handleGetProfileFailure,
  [ActionTypes.GET_POSTS_BY_AUTHOR_ID_REQUEST]: handleGetPostsAuthorRequest,
  [ActionTypes.GET_POSTS_BY_AUTHOR_ID_SUCCESS]: handleGetPostsAuthorSuccess,
  [ActionTypes.GET_POSTS_BY_AUTHOR_ID_FAILURE]: handleGetPostsAuthorFailure,
  [ActionTypes.PROFILE_GET_ALL_CATEGORY_REQUEST]: handleGetAllCategoryRequest,
  [ActionTypes.PROFILE_GET_ALL_CATEGORY_SUCCESS]: handleGetAllCategorySuccess,
  [ActionTypes.PROFILE_GET_ALL_CATEGORY_FAILURE]: handleGetAllCategoryFailure,
  [DELETE_POST_SUCCESS]: handleDeletePostSuccess,
  [FOLLOW_USER_BY_ID_SUCCESS]: handleFollowUserSuccess,
  [LOGOUT_SUCCESS]: handleLogoutSuccess,
})

export default profileReducer

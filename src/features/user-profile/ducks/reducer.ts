import { get, isEmpty } from 'lodash'
import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import * as ReviewActionTypes from 'features/reviews/ducks/action-types'
import { act } from 'react-test-renderer'

const initialUserProfileState = {
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
}

const initialState = {
  initProfile: initialUserProfileState,
}

const handleGetProfileRequest = (state: any, action: any) => {
  const userId = get(action, 'payload.userId', 'initProfile')

  return update(state, {
    [userId]: {
      $set: initialUserProfileState,
    },
  })
}

const handleGetProfileSuccess = (state: any, action: any) => {
  const userId = get(action, 'payload.result._id', '')
  const followingsCount = get(action, 'payload.result.followingsCount', 0)
  const followersCount = get(action, 'payload.result.followersCount', 0)
  const postsCount = get(action, 'payload.result.postsCount', 0)
  const reviewsCount = get(action, 'payload.result.reviewsCount', 0)

  return update(state, {
    [userId]: {
      error: {
        $set: null,
      },
      userInfo: {
        $set: action.payload.result,
      },
      followingsCount: {
        $set: followingsCount,
      },
      followersCount: {
        $set: followersCount,
      },
      postsCount: {
        $set: postsCount,
      },
      reviewsCount: {
        $set: reviewsCount,
      },
    },
  })
}

const handleGetUserProfileRatingPostsRequest = (state, action) => {
  const userId = get(action, 'payload.userId', '')

  return update(state, {
    [userId]: {
      loading: { $set: true },
    },
  })
}

const handleGetUserProfileRatingPostsSuccess = (state, action) => {
  const userId = get(action, 'payload.result._id', '')
  const ratingTotalPosts = get(action, 'payload.result.totalPosts', 0)
  const ratingTotalPoints = get(action, 'payload.result.totalPoints', 0)

  return update(state, {
    [userId]: {
      loading: { $set: false },
      error: { $set: null },
      ratingTotalPosts: { $set: ratingTotalPosts },
      ratingTotalPoints: { $set: ratingTotalPoints },
    },
  })
}

const handleGetProfileFailure = (state: any, action: any) => {
  return update(state, {
    [action.payload.userId]: {
      error: {
        $set: action.payload.error,
      },
    },
  })
}

const handleGetPostsAuthorRequest = (state: any, action: any) => {
  const { skip, userId } = action.payload

  return update(state, {
    [userId]: {
      loading: {
        $set: true,
      },
      error: {
        $set: null,
      },
      pagination: {
        skip: {
          $set: skip,
        },
      },
    },
  })
}

const handleGetPostsAuthorSuccess = (state: any, action: any) => {
  const ids = action.payload.result.map((post: any) => post.id)
  const userId = get(action, 'payload.userId', 'initProfile')

  return update(state, {
    [userId]: {
      loading: {
        $set: false,
      },
      error: {
        $set: null,
      },
      postIds:
        state[userId].pagination.skip > 0 ? { $push: ids } : { $set: ids },
      pagination: {
        endReached: {
          $set: ids.length < DEFAULT_ITEMS_PER_PAGE,
        },
      },
    },
  })
}

const handleGetPostsAuthorFailure = (state: any, action: any) => {
  const userId = get(action, 'payload.userId', 'initProfile')

  return update(state, {
    [userId]: {
      loading: {
        $set: false,
      },
      error: {
        $set: action.payload.error,
      },
    },
  })
}

const handleAddReviewSuccess = (state, action) => {
  const userId = get(action, 'payload.userId', 'initProfile')

  return update(state, {
    [userId]: {
      reviewsCount: {
        $set: state[userId].reviewsCount + 1,
      },
    },
  })
}

const userProfileReducer = createReducer(initialState, {
  [ActionTypes.GET_PUBLIC_USER_PROFILE_REQUEST]: handleGetProfileRequest,
  [ActionTypes.GET_PUBLIC_USER_PROFILE_SUCCESS]: handleGetProfileSuccess,
  [ActionTypes.GET_PUBLIC_USER_PROFILE_FAILURE]: handleGetProfileFailure,
  [ActionTypes.GET_USER_PROFILE_RATING_POSTS_REQUEST]: handleGetUserProfileRatingPostsRequest,
  [ActionTypes.GET_USER_PROFILE_RATING_POSTS_SUCCESS]: handleGetUserProfileRatingPostsSuccess,
  [ActionTypes.GET_USER_PROFILE_RATING_POSTS_FAILURE]: handleGetProfileFailure,
  [ActionTypes.GET_POSTS_BY_AUTHOR_ID_REQUEST]: handleGetPostsAuthorRequest,
  [ActionTypes.GET_POSTS_BY_AUTHOR_ID_SUCCESS]: handleGetPostsAuthorSuccess,
  [ActionTypes.GET_POSTS_BY_AUTHOR_ID_FAILURE]: handleGetPostsAuthorFailure,
  [ReviewActionTypes.ADD_NEW_REVIEW_SUCCESS]: handleAddReviewSuccess,
})

export default userProfileReducer

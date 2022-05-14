import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'

const initialState = {
  followerIds: [],
  followingIds: [],
  loading: false,
  error: null,
}

const handleGetFollowersRequest = (state: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleGetFollowersSuccess = (state: any, action: any) => {
  const followers = get(action, 'payload.results', [])
  const followerIds = followers.map((follower: any) => follower.id)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    followerIds: { $set: followerIds },
  })
}

const handleFollowFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleGetFollowingsRequest = (state: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleGetFollowingsSuccess = (state: any, action: any) => {
  const followings = get(action, 'payload.results', [])
  const followingIds = followings.map((follower: any) => follower.id)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    followingIds: { $set: followingIds },
  })
}

const resetToDefault = () => {
  return initialState
}

const handleFollowUserRequest = (state: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleFollowUserSuccess = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: null },
  })
}

const followerFollowingReducer = createReducer(initialState, {
  [ActionTypes.GET_FOLLOWERS_REQUEST]: handleGetFollowersRequest,
  [ActionTypes.GET_FOLLOWERS_SUCCESS]: handleGetFollowersSuccess,
  [ActionTypes.GET_FOLLOWERS_FAILURE]: handleFollowFailure,
  [ActionTypes.GET_FOLLOWINGS_REQUEST]: handleGetFollowingsRequest,
  [ActionTypes.GET_FOLLOWINGS_SUCCESS]: handleGetFollowingsSuccess,
  [ActionTypes.GET_FOLLOWINGS_FAILURE]: handleFollowFailure,
  [ActionTypes.RESET_FOLLOWER_FOLLOWING]: resetToDefault,
  [ActionTypes.FOLLOW_USER_BY_ID_REQUEST]: handleFollowUserRequest,
  [ActionTypes.FOLLOW_USER_BY_ID_SUCCESS]: handleFollowUserSuccess,
  [ActionTypes.FOLLOW_USER_BY_ID_FAILURE]: handleFollowFailure,
})

export default followerFollowingReducer

import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { DEFAULT_RECOMMEND_TOP_PROFILES_PER_PAGE } from 'constants'
import { get } from 'lodash'

const initialState = {
  pagination: {
    skip: 0,
    endReached: false,
  },
  loading: false,
  error: null,
  profiles: [],
}

const handleTopProfilesList = (state: any, action: any) => {
  const { skip } = action.payload

  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleTopProfilesListSuccess = (state: any, action: any) => {
  const profiles = get(action, 'payload.profileResults', [])

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    profiles: { $push: profiles },
    pagination: {
      endReached: {
        $set: profiles.length < DEFAULT_RECOMMEND_TOP_PROFILES_PER_PAGE,
      },
    },
  })
}

const handleTopProfilesListFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleResetTopProfileList = () => {
  return initialState
}

const topProfilesReducer = createReducer(initialState, {
  [ActionTypes.RECOMMENDED_PROFILES_TOP_RANKED_BUSINESSES_OR_PERSONAL]: handleTopProfilesList,
  [ActionTypes.RECOMMENDED_PROFILES_TOP_RANKED_BUSINESSES_OR_PERSONAL_SUCCESS]: handleTopProfilesListSuccess,
  [ActionTypes.RECOMMENDED_PROFILES_TOP_RANKED_BUSINESSES_OR_PERSONAL_FAILURE]: handleTopProfilesListFailure,

  [ActionTypes.RESET_TOP_PROFILE_RECOMMENDED_LIST]: handleResetTopProfileList,
})

export default topProfilesReducer

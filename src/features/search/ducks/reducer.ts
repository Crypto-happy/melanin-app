import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import {
  DEFAULT_FEATURE_MEDIA_PER_PAGE,
  DEFAULT_ITEMS_PER_PAGE,
} from '../../../constants'
import { get, shuffle, slice, groupBy } from 'lodash'

const initialState = {
  userIds: [],
  usersById: {},
  pagination: {
    skip: 0,
    endReached: false,
  },
  mediaPagination: {
    skip: 0,
    endReached: false,
  },
  postIds: [],
  loading: false,
  error: null,
  profiles: [],
  topBusiness: [],
  media: [],
}

const handleUserListRequest = (state, action) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleUserListSuccess = (state, action) => {
  const users = get(action, 'payload.result') || []
  const usersById = users.reduce((result: any, user: any) => {
    result[user._id] = user
    return result
  }, {})

  const ids = Object.keys(usersById)
  const { hasNoSearching } = action.payload
  const limit = hasNoSearching
    ? DEFAULT_ITEMS_PER_PAGE * 2
    : DEFAULT_ITEMS_PER_PAGE

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    userIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    usersById: { $merge: usersById },
    pagination: {
      endReached: { $set: ids.length < limit },
    },
  })
}

const handleUserListFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleSearchPostsRequest = (state, action) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleSearchPostsSuccess = (state, action) => {
  const ids = action.payload.result.map((post: any) => post.id)
  const { hasNoSearching } = action.payload
  const limit = hasNoSearching
    ? DEFAULT_ITEMS_PER_PAGE * 2
    : DEFAULT_ITEMS_PER_PAGE

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    postIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < limit },
    },
  })
}

const handleSearchPostsFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const resetSearchedList = (state) => {
  return update(state, {
    postIds: { $set: [] },
    userIds: { $set: [] },
    usersById: { $set: {} },
    profiles: { $set: [] },
    topBusiness: { $set: [] },
  })
}

const handleRecommendList = (state) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleRecommendListSuccess = (state, action) => {
  const profiles = shuffle(get(action, 'payload.profileResults', []))
  const topBusiness = shuffle(get(action, 'payload.topBusinessResults', []))

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    profiles: { $push: slice(profiles, 0, 4) },
    topBusiness: { $push: slice(topBusiness, 0, 4) },
  })
}

const handleRecommendListFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleMediaRequest = (state, action) => {
  const { skip } = action.payload

  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    mediaPagination: {
      skip: { $set: skip },
    },
  })
}

const handleMediaSuccess = (state, action) => {
  const { medias = [] } = action.payload

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    media: { $push: shuffle(medias) },
    mediaPagination: {
      endReached: { $set: medias.length < DEFAULT_FEATURE_MEDIA_PER_PAGE },
    },
  })
}

const handleMediaFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const searchReducer = createReducer(initialState, {
  [ActionTypes.GET_USERLIST_REQUEST]: handleUserListRequest,
  [ActionTypes.GET_USERLIST_SUCCESS]: handleUserListSuccess,
  [ActionTypes.GET_USERLIST_FAILURE]: handleUserListFailure,

  [ActionTypes.RESET_SEARCHED_LIST]: resetSearchedList,

  [ActionTypes.GET_SEARCH_POSTS_REQUEST]: handleSearchPostsRequest,
  [ActionTypes.GET_SEARCH_POSTS_SUCCESS]: handleSearchPostsSuccess,
  [ActionTypes.GET_SEARCH_POSTS_FAILURE]: handleSearchPostsFailure,

  [ActionTypes.RECOMMENDED_PROFILES_AND_TOP_RANKED_BUSINESSES]: handleRecommendList,
  [ActionTypes.RECOMMENDED_PROFILES_AND_TOP_RANKED_BUSINESSES_SUCCESS]: handleRecommendListSuccess,
  [ActionTypes.RECOMMENDED_PROFILES_AND_TOP_RANKED_BUSINESSES_FAILURE]: handleRecommendListFailure,

  [ActionTypes.FEATURED_MEDIA]: handleMediaRequest,
  [ActionTypes.FEATURED_MEDIA_SUCCESS]: handleMediaSuccess,
  [ActionTypes.FEATURED_MEDIA_FAILURE]: handleMediaFailure,
})

export default searchReducer

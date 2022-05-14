import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const initialState = {
  loading: false,
  success: false,
  error: false,
  profiles: [],
  paginationProfiles: {
    skip: 0,
    endReached: false,
  },
  profileScrollEnded: false,
  topBusinesses: [],
  paginationBusinesses: {
    skip: 0,
    endReached: false,
  },
  businessScrollEnded: false,
  featuredVideos: [],
  paginationVideos: {
    skip: 0,
    endReached: false,
  },
  videosScrollEnded: false,
  featuredPhotos: [],
  paginationPhotos: {
    skip: 0,
    endReached: false,
  },
  photosScrollEnded: false,
}

const resetToDefault = () => {
  return initialState
}

const handleRecommendedProfilesRequest = (state: any, action: any) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: false },
    paginationProfiles: {
      skip: { $set: skip },
    },
  })
}

const handleRecommendedProfilesSuccess = (state: any, action: any) => {
  const profiles = get(action, 'payload.results', {})

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    profiles: { $push: profiles },
    paginationProfiles: {
      endReached: { $set: profiles.length < DEFAULT_ITEMS_PER_PAGE },
    },
    profileScrollEnded: { $set: profiles.length == 0 },
  })
}

const handleRecommendedProfilesFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleTopRankedBusinessesRequest = (state: any, action: any) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: false },
    paginationBusinesses: {
      skip: { $set: skip },
    },
  })
}

const handleTopRankedBusinessesSuccess = (state: any, action: any) => {
  const topBusinesses = get(action, 'payload.results', {})

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    topBusinesses: { $push: topBusinesses },
    paginationBusinesses: {
      endReached: { $set: topBusinesses.length < DEFAULT_ITEMS_PER_PAGE },
    },
    businessScrollEnded: { $set: topBusinesses.length == 0 },
  })
}

const handleTopRankedBusinessesFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleFeaturedVideosRequest = (state: any, action: any) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: false },
    paginationVideos: {
      skip: { $set: skip },
    },
  })
}

const handleFeaturedVideosSuccess = (state: any, action: any) => {
  const featuredVideos = get(action, 'payload.results', {})

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    featuredVideos: { $push: featuredVideos },
    paginationVideos: {
      endReached: { $set: featuredVideos.length < DEFAULT_ITEMS_PER_PAGE },
    },
    videosScrollEnded: { $set: featuredVideos.length == 0 },
  })
}

const handleFeaturedVideosFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleFeaturedPhotosRequest = (state: any, action: any) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: false },
    paginationPhotos: {
      skip: { $set: skip },
    },
  })
}

const handleFeaturedPhotosSuccess = (state: any, action: any) => {
  const featuredPhotos = get(action, 'payload.results', {})

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    featuredPhotos: { $push: featuredPhotos },
    paginationPhotos: {
      endReached: { $set: featuredPhotos.length < DEFAULT_ITEMS_PER_PAGE },
    },
    photosScrollEnded: { $set: featuredPhotos.length == 0 },
  })
}

const handleFeaturedPhotosFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const exploreReducer = createReducer(initialState, {
  [ActionTypes.RESET_ITEMS]: resetToDefault,

  [ActionTypes.RECOMMENDED_PROFILES]: handleRecommendedProfilesRequest,
  [ActionTypes.RECOMMENDED_PROFILES_SUCCESS]: handleRecommendedProfilesSuccess,
  [ActionTypes.RECOMMENDED_PROFILES_FAILURE]: handleRecommendedProfilesFailure,

  [ActionTypes.TOP_RANKED_BUSINESSES]: handleTopRankedBusinessesRequest,
  [ActionTypes.TOP_RANKED_BUSINESSES_SUCCESS]: handleTopRankedBusinessesSuccess,
  [ActionTypes.TOP_RANKED_BUSINESSES_FAILURE]: handleTopRankedBusinessesFailure,

  [ActionTypes.FEATURED_VIDEOS]: handleFeaturedVideosRequest,
  [ActionTypes.FEATURED_VIDEOS_SUCCESS]: handleFeaturedVideosSuccess,
  [ActionTypes.FEATURED_VIDEOS_FAILURE]: handleFeaturedVideosFailure,

  [ActionTypes.FEATURED_PHOTOS]: handleFeaturedPhotosRequest,
  [ActionTypes.FEATURED_PHOTOS_SUCCESS]: handleFeaturedPhotosSuccess,
  [ActionTypes.FEATURED_PHOTOS_FAILURE]: handleFeaturedPhotosFailure,
})

export default exploreReducer

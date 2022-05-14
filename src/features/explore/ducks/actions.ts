import * as ActionTypes from './action-types'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const resetItems = () => ({
  type: ActionTypes.RESET_ITEMS,
  showLoading: false,
})

export const recommendedProfiles = (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => ({
  type: ActionTypes.RECOMMENDED_PROFILES,
  payload: { userId, skip, limit, filterMin, filterMax },
  showLoading: true,
})

export const recommendedProfilesSuccess = (results: any) => ({
  type: ActionTypes.RECOMMENDED_PROFILES_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const recommendedProfilesFailure = (error: any) => ({
  type: ActionTypes.RECOMMENDED_PROFILES_FAILURE,
  payload: { error },
  showLoading: false,
})

export const topRankedBusinesses = (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => ({
  type: ActionTypes.TOP_RANKED_BUSINESSES,
  payload: { userId, skip, limit, filterMin, filterMax },
  showLoading: true,
})

export const topRankedBusinessesSuccess = (results: any) => ({
  type: ActionTypes.TOP_RANKED_BUSINESSES_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const topRankedBusinessesFailure = (error: any) => ({
  type: ActionTypes.TOP_RANKED_BUSINESSES_FAILURE,
  payload: { error },
  showLoading: false,
})

export const featuredVideos = (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => ({
  type: ActionTypes.FEATURED_VIDEOS,
  payload: { userId, skip, limit, filterMin, filterMax },
  showLoading: true,
})

export const featuredVideosSuccess = (results: any) => ({
  type: ActionTypes.FEATURED_VIDEOS_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const featuredVideosFailure = (error: any) => ({
  type: ActionTypes.FEATURED_VIDEOS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const featuredPhotos = (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => ({
  type: ActionTypes.FEATURED_PHOTOS,
  payload: { userId, skip, limit, filterMin, filterMax },
  showLoading: true,
})

export const featuredPhotosSuccess = (results: any) => ({
  type: ActionTypes.FEATURED_PHOTOS_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const featuredPhotosFailure = (error: any) => ({
  type: ActionTypes.FEATURED_PHOTOS_FAILURE,
  payload: { error },
  showLoading: false,
})

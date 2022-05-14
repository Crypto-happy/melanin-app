import * as ActionTypes from './action-types'
import { DEFAULT_FEATURE_MEDIA_PER_PAGE } from 'constants'
import { ACCOUNT_TYPE } from 'types'

export const getUserListRequest = (
  skip: number,
  limit: number,
  search: string,
) => ({
  type: ActionTypes.GET_USERLIST_REQUEST,
  payload: {
    skip,
    limit,
    search,
  },
  showLoading: false,
})

export const getUserListSuccess = (result: any, hasNoSearching: boolean) => {
  return {
    type: ActionTypes.GET_USERLIST_SUCCESS,
    payload: { result, hasNoSearching },
    showLoading: false,
  }
}

export const getUserListFailure = (error: any) => ({
  type: ActionTypes.GET_USERLIST_FAILURE,
  payload: { error },
  showLoading: false,
})

export const resetSearchedListRequest = () => ({
  type: ActionTypes.RESET_SEARCHED_LIST,
})

export const getSearchPostsRequest = (
  skip: number,
  limit: number,
  search: string,
) => ({
  type: ActionTypes.GET_SEARCH_POSTS_REQUEST,
  payload: {
    skip,
    limit,
    search,
  },
  showLoading: false,
})

export const getPostsSuccess = (result: any, hasNoSearching: boolean) => ({
  type: ActionTypes.GET_SEARCH_POSTS_SUCCESS,
  payload: { result, hasNoSearching },
  showLoading: false,
})

export const getPostsFailure = (error: any) => ({
  type: ActionTypes.GET_SEARCH_POSTS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const recommendedProfilesAndTopRankedBusiness = (
  userId: string,
  skip: number = 0,
  limit: number = 16,
  filterMin: number = 2,
  filterMax: number = 5,
) => ({
  type: ActionTypes.RECOMMENDED_PROFILES_AND_TOP_RANKED_BUSINESSES,
  payload: {
    userId,
    skip,
    limit,
    filterMin,
    filterMax,
    profileTypes: [ACCOUNT_TYPE.PERSONAL, ACCOUNT_TYPE.BUSINESS],
  },
  showLoading: true,
})

export const recommendedProfilesAndTopRankedBusinessSuccess = (
  profileResults: any,
  topBusinessResults: any,
) => ({
  type: ActionTypes.RECOMMENDED_PROFILES_AND_TOP_RANKED_BUSINESSES_SUCCESS,
  payload: { profileResults, topBusinessResults },
  showLoading: false,
})

export const recommendedProfilesAndTopRankedBusinessFailure = (error: any) => ({
  type: ActionTypes.RECOMMENDED_PROFILES_AND_TOP_RANKED_BUSINESSES_FAILURE,
  payload: { error },
  showLoading: false,
})

export const featuredMedia = (
  skip: number = 0,
  limit: number = DEFAULT_FEATURE_MEDIA_PER_PAGE,
) => ({
  type: ActionTypes.FEATURED_MEDIA,
  payload: { skip, limit },
  showLoading: true,
})

export const featuredMediaSuccess = (medias: any) => ({
  type: ActionTypes.FEATURED_MEDIA_SUCCESS,
  payload: { medias },
  showLoading: false,
})

export const featuredMediaFailure = (error: any) => ({
  type: ActionTypes.FEATURED_MEDIA_FAILURE,
  payload: { error },
  showLoading: false,
})

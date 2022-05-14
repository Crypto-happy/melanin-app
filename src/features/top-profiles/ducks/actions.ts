import * as ActionTypes from './action-types'
import { DEFAULT_RECOMMEND_TOP_PROFILES_PER_PAGE } from 'constants'

export const recommendedTopProfiles = (
  profileType: string,
  skip: number = 0,
  limit: number = DEFAULT_RECOMMEND_TOP_PROFILES_PER_PAGE,
  filterMin: number = 2,
  filterMax: number = 5,
) => ({
  type: ActionTypes.RECOMMENDED_PROFILES_TOP_RANKED_BUSINESSES_OR_PERSONAL,
  payload: {
    skip,
    limit,
    filterMin,
    filterMax,
    profileTypes: [profileType],
  },
  showLoading: true,
})

export const recommendedProfilesAndTopRankedBusinessSuccess = (
  profileResults: any,
) => ({
  type:
    ActionTypes.RECOMMENDED_PROFILES_TOP_RANKED_BUSINESSES_OR_PERSONAL_SUCCESS,
  payload: { profileResults },
  showLoading: false,
})

export const recommendedProfilesAndTopRankedBusinessFailure = (error: any) => ({
  type:
    ActionTypes.RECOMMENDED_PROFILES_TOP_RANKED_BUSINESSES_OR_PERSONAL_FAILURE,
  payload: { error },
  showLoading: false,
})

export const resetRecommendedProfilesAndTopRankedBusiness = () => ({
  type: ActionTypes.RESET_TOP_PROFILE_RECOMMENDED_LIST,
})

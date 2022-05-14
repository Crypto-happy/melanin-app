import * as ActionTypes from './action-types'

export const getCustomerReviewRequest = () => ({
  type: ActionTypes.GET_CUSTOMER_REVIEW_REQUEST,
  showLoading: true,
})

export const  getCustomerReviewSuccess = (result: any) => ({
  type: ActionTypes.GET_CUSTOMER_REVIEW_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const  getCustomerReviewFailure = (error: any) => ({
  type: ActionTypes.GET_CUSTOMER_REVIEW_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getProfileStatsRequest = (dropdownType:string) => ({
  type: ActionTypes.GET_PROFILE_STATS_REQUEST,
  payload: { dropdownType },
  showLoading: true,
})

export const  getProfileStatsSuccess = (result: any) => ({
  type: ActionTypes.GET_PROFILE_STATS_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const  getProfileStatsFailure = (error: any) => ({
  type: ActionTypes.GET_PROFILE_STATS_FAILURE,
  payload: { error },
  showLoading: false,
})


export const getTopPostsRequest = (skip: number, limit: number, type:string) => ({
  type: ActionTypes.GET_TOP_POST_REQUEST,
  payload: {
    skip,
    limit,
    type
  },
  showLoading: true,
})

export const getTopPostsSuccess = (result: any) => ({
  type: ActionTypes.GET_TOP_POST_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getTopPostsFailure = (error: any) => ({
  type: ActionTypes.GET_TOP_POST_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getPageInteractionRequest = (dropdownType:string) => ({
  type: ActionTypes.GET_PAGE_INTERACTION_REQUEST,
  payload: {
    dropdownType
  },
  showLoading: true,
})

export const  getPageInteractionSuccess = (result: any) => ({
  type: ActionTypes.GET_PAGE_INTERACTION_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const  getPageInteractionFailure = (error: any) => ({
  type: ActionTypes.GET_PAGE_INTERACTION_FAILURE,
  payload: { error },
  showLoading: false,
})
import * as ActionTypes from './action-types'

export const getBusinessCategoriesRequest = () => ({
  type: ActionTypes.GET_BUSINESS_CATEGORIES_REQUEST,
  showLoading: true,
})

export const getBusinessCategoriesSuccess = (result: any) => ({
  type: ActionTypes.GET_BUSINESS_CATEGORIES_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const getBusinessCategoriesFailure = (error: any) => ({
  type: ActionTypes.GET_BUSINESS_CATEGORIES_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

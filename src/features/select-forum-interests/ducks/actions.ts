import * as ActionTypes from './action-types'

export const getForumInterestCategoriesRequest = () => ({
  type: ActionTypes.GET_FORUM_CATEGORIES_REQUEST,
  showLoading: true,
})

export const getForumInterestCategoriesSuccess = (result: any) => ({
  type: ActionTypes.GET_FORUM_CATEGORIES_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getForumInterestCategoriesFailure = (error: any) => ({
  type: ActionTypes.GET_FORUM_CATEGORIES_FAILURE,
  payload: { error },
  showLoading: false,
})

export const selectForumInterestCategory = (id: string) => ({
  type: ActionTypes.SELECT_FORUM_INTEREST_CATEGORY,
  payload: { id },
})

export const selectForumInterestSubCategory = (id: string) => ({
  type: ActionTypes.SELECT_FORUM_INTEREST_SUBCATEGORY,
  payload: { id },
})

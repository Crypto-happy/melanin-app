import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { indexOf, clone } from 'lodash'

const initialState = {
  categories: [],
  selectedCategoryIds: [],
  selectedSubCategoryIds: [],
  loading: false,
  error: null,
}

const handlegetForumInterestCategoriesRequest = (state: any) =>
  update(state, {
    loading: { $set: true },
    error: { $set: null },
  })

const handlegetForumInterestCategoriesSuccess = (
  state: any,
  { payload: { result } }: any,
) =>
  update(state, {
    loading: { $set: false },
    categories: { $set: result },
  })

const handlegetForumInterestCategoriesFailure = (
  state: any,
  { payload: { error } }: any,
) =>
  update(state, {
    loading: { $set: false },
    error: { $set: error },
  })

const selectForumInterestCategory = (state: any, { payload: { id } }: any) => {
  const { selectedCategoryIds } = state
  const newSelectedCategoryIds = clone(selectedCategoryIds)
  const selectedIdIndex = indexOf(newSelectedCategoryIds, id)

  if (selectedIdIndex === -1) {
    newSelectedCategoryIds.push(id)
  } else {
    newSelectedCategoryIds.splice(selectedIdIndex, 1)
  }

  return update(state, {
    selectedCategoryIds: { $set: newSelectedCategoryIds },
  })
}

const selectForumInterestSubCategory = (
  state: any,
  { payload: { id } }: any,
) => {
  const { selectedSubCategoryIds } = state
  const newSelectedSubCategoryIds = clone(selectedSubCategoryIds)
  const selectedIdIndex = indexOf(newSelectedSubCategoryIds, id)

  if (selectedIdIndex === -1) {
    newSelectedSubCategoryIds.push(id)
  } else {
    newSelectedSubCategoryIds.splice(selectedIdIndex, 1)
  }

  return update(state, {
    selectedSubCategoryIds: { $set: newSelectedSubCategoryIds },
  })
}

const forumInterestsReducer = createReducer(initialState, {
  [ActionTypes.GET_FORUM_CATEGORIES_REQUEST]: handlegetForumInterestCategoriesRequest,
  [ActionTypes.GET_FORUM_CATEGORIES_SUCCESS]: handlegetForumInterestCategoriesSuccess,
  [ActionTypes.GET_FORUM_CATEGORIES_FAILURE]: handlegetForumInterestCategoriesFailure,
  [ActionTypes.SELECT_FORUM_INTEREST_CATEGORY]: selectForumInterestCategory,
  [ActionTypes.SELECT_FORUM_INTEREST_SUBCATEGORY]: selectForumInterestSubCategory,
})

export default forumInterestsReducer

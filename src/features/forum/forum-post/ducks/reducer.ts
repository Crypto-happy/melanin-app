import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

interface forumPostReducerState {
  selectedCategoryId: string
  loading: boolean
}

const initialState: forumPostReducerState = {
  selectedCategoryId: '',
  loading: false,
}

const selectForumPostCategory = (
  state: forumPostReducerState,
  { payload: { id } }: any,
) => {
  return update(state, {
    selectedCategoryId: { $set: id },
  })
}

const forumPostLoading = (state: forumPostReducerState) =>
  update(state, { loading: { $set: true } })

const forumPostNotLoading = (state: forumPostReducerState) =>
  update(state, { loading: { $set: false } })

const forumFormReducer = createReducer(initialState, {
  [ActionTypes.SELECT_FORUM_FORM_CATEGORY]: selectForumPostCategory,
  [ActionTypes.FORUM_POST_LOADING]: forumPostLoading,
  [ActionTypes.FORUM_POST_NOT_LOADING]: forumPostNotLoading,
})

export default forumFormReducer

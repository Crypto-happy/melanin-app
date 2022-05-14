import * as ActionTypes from './action-types'

export const selectForumFormCategoryId = (id: string) => ({
  type: ActionTypes.SELECT_FORUM_FORM_CATEGORY,
  payload: { id },
})

export const createForumPostRequest = (forumPost: any) => ({
  type: ActionTypes.CREATE_FORUM_POST_REQUEST,
  payload: {
    forumPost,
  },
  showLoading: true,
})

export const createForumPostSuccess = () => ({
  type: ActionTypes.CREATE_FORUM_POST_SUCCESS,
  showLoading: false,
})

export const createForumPostFailure = (error: any) => ({
  type: ActionTypes.CREATE_FORUM_POST_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const forumPostLoading = () => ({
  type: ActionTypes.FORUM_POST_LOADING,
})

export const forumPostNotLoading = () => ({
  type: ActionTypes.FORUM_POST_NOT_LOADING,
})

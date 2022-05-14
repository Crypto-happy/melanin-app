import * as ActionTypes from './action-types'

export const getPostByIdRequest = (id: string) => ({
  type: ActionTypes.GET_POST_BY_ID_REQUEST,
  payload: { id },
  showLoading: true,
})

export const getPostByIdSuccess = (result: any) => ({
  type: ActionTypes.GET_POST_BY_ID_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getPostByIdFailure = (error: any) => ({
  type: ActionTypes.GET_POST_BY_ID_FAILURE,
  payload: { error },
  showLoading: false,
})

export const sharePostRequest = (id: string, text) => ({
  type: ActionTypes.SHARE_POST_REQUEST,
  payload: { id, text },
  showLoading: true,
})

export const sharePostSuccess = (result: any) => ({
  type: ActionTypes.SHARE_POST_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const sharePostFailure = (error: any) => ({
  type: ActionTypes.SHARE_POST_FAILURE,
  payload: { error },
  showLoading: false,
})

export const shareExternalPostRequest = (id: string) => ({
  type: ActionTypes.SHARE_EXTERNAL_POST_REQUEST,
  payload: { id },
  showLoading: true,
})

export const shareExternalPostSuccess = (result: any) => ({
  type: ActionTypes.SHARE_EXTERNAL_POST_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const shareExternalPostFailure = (error: any) => ({
  type: ActionTypes.SHARE_EXTERNAL_POST_FAILURE,
  payload: { error },
  showLoading: false,
})

export const addCommentRequest = (postId: string, text: string) => ({
  type: ActionTypes.ADD_COMMENT_REQUEST,
  payload: { postId, text },
})

export const addCommentSuccess = (result: any) => ({
  type: ActionTypes.ADD_COMMENT_SUCCESS,
  payload: { result },
})

export const addCommentFailure = (error: any) => ({
  type: ActionTypes.ADD_COMMENT_FAILURE,
  payload: { error },
})

export const replyCommentRequest = (commentId: string, text: string) => ({
  type: ActionTypes.REPLY_COMMENT_REQUEST,
  payload: { commentId, text },
})

export const replyCommentSuccess = (result: any) => ({
  type: ActionTypes.REPLY_COMMENT_SUCCESS,
  payload: { result },
})

export const replyCommentFailure = (error: any) => ({
  type: ActionTypes.REPLY_COMMENT_FAILURE,
  payload: { error },
})

export const likeCommentRequest = (commentId: string) => ({
  type: ActionTypes.LIKE_COMMENT_REQUEST,
  payload: { commentId },
})

export const likeCommentSuccess = (result: any) => ({
  type: ActionTypes.LIKE_COMMENT_SUCCESS,
  payload: { result },
})

export const likeCommentFailure = (error: any) => ({
  type: ActionTypes.LIKE_COMMENT_FAILURE,
  payload: { error },
})

export const getPostCommentsRequest = (
  postId: string,
  skip: number,
  limit: number,
) => ({
  type: ActionTypes.GET_POST_COMMENTS_REQUEST,
  payload: { postId, skip, limit },
  showLoading: true,
})

export const getPostCommentsSuccess = (result: any) => ({
  type: ActionTypes.GET_POST_COMMENTS_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const getPostCommentsFailure = (error: any) => ({
  type: ActionTypes.GET_POST_COMMENTS_FAILURE,
  payload: { error },
  showLoading: false,
})

export const deleteCommentRequest = (commentId: string) => ({
  type: ActionTypes.DELETE_COMMENT_REQUEST,
  payload: { commentId },
})

export const deleteCommentSuccess = (result: any, commentId: string) => ({
  type: ActionTypes.DELETE_COMMENT_SUCCESS,
  payload: { result, commentId },
})

export const deleteCommentFailure = (error: any) => ({
  type: ActionTypes.DELETE_COMMENT_FAILURE,
  payload: { error },
})

export const updateCommentRequest = (commentId: string, text: string) => ({
  type: ActionTypes.UPDATE_COMMENT_REQUEST,
  payload: { commentId, text },
})

export const updateCommentSuccess = (result: any) => ({
  type: ActionTypes.UPDATE_COMMENT_SUCCESS,
  payload: { result },
})

export const updateCommentFailure = (error: any) => ({
  type: ActionTypes.UPDATE_COMMENT_FAILURE,
  payload: { error },
})

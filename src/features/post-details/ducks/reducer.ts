import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { findIndex } from 'lodash'

import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import {
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
} from 'features/home/ducks/action-types'

const initialState = {
  loading: false,
  success: false,
  error: null,
  pagination: {
    skip: 0,
    endReached: false,
  },
  commentIds: [],
  deleteSuccess: false,
}

const handleGetPostByIdRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: null },
  })
}

const handleGetPostByIdSuccess = (state, action) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: null },
  })
}

const handleGetPostByIdFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleGetPostCommentsRequest = (state: any, action: any) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleGetPostCommentsSuccess = (state: any, action: any) => {
  const ids = action.payload.result.map((comment: any) => comment.id)

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: null },
    commentIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}

const handleGetPostCommentsFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleAddCommentSuccess = (state: any, action: any) => {
  return update(state, {
    commentIds: {
      $push: [action.payload.result._id],
    },
  })
}

const handleDeletePostRequest = (state: any, action: any) => {
  return update(state, {
    deleteSuccess: { $set: false },
    loading: { $set: true },
    error: { $set: null },
  })
}
const handleDeletePostSuccess = (state: any, action: any) => {
  return update(state, {
    deleteSuccess: { $set: true },
    loading: { $set: false },
    error: { $set: null },
  })
}

const handleDeletePostFailure = (state: any, action: any) => {
  return update(state, {
    deleteSuccess: { $set: false },
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleDeleteCommentRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}
const handleDeleteCommentSuccess = (state: any, action: any) => {
  const { commentId } = action.payload

  const deletedIndex = findIndex(state.commentIds, function (id) {
    return id === commentId
  })

  return update(state, {
    commentIds: { $splice: [[deletedIndex, 1]] },
    loading: { $set: false },
    error: { $set: null },
  })
}

const handleDeleteCommentFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const postDetailsReducer = createReducer(initialState, {
  [ActionTypes.GET_POST_BY_ID_REQUEST]: handleGetPostByIdRequest,
  [ActionTypes.GET_POST_BY_ID_SUCCESS]: handleGetPostByIdSuccess,
  [ActionTypes.GET_POST_BY_ID_FAILURE]: handleGetPostByIdFailure,
  [ActionTypes.GET_POST_COMMENTS_REQUEST]: handleGetPostCommentsRequest,
  [ActionTypes.GET_POST_COMMENTS_SUCCESS]: handleGetPostCommentsSuccess,
  [ActionTypes.GET_POST_COMMENTS_FAILURE]: handleGetPostCommentsFailure,
  [ActionTypes.ADD_COMMENT_SUCCESS]: handleAddCommentSuccess,
  [DELETE_POST_REQUEST]: handleDeletePostRequest,
  [DELETE_POST_SUCCESS]: handleDeletePostSuccess,
  [DELETE_POST_FAILURE]: handleDeletePostFailure,
  [ActionTypes.DELETE_COMMENT_REQUEST]: handleDeleteCommentRequest,
  [ActionTypes.DELETE_COMMENT_SUCCESS]: handleDeleteCommentSuccess,
  [ActionTypes.DELETE_COMMENT_FAILURE]: handleDeleteCommentFailure,
})

export default postDetailsReducer

import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../constants'

const initialState = {
  postIds: [],
  pagination: {
    skip: 0,
    endReached: false,
  },
  loading: false,
  error: null,
  deleteSuccess: false,
  blockUserSuccess: false,
  blockType: '',
}

const handleGetPostsRequest = (
  state: any,
  action: { payload: { skip: any } },
) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleGetPostsSuccess = (
  state: {
    loading: boolean
    error: any
    postIds: string[]
    pagination: { skip: number; endReached: boolean }
  },
  action: { payload: { result: any[] } },
) => {
  const ids = action.payload.result.map((post: any) => post.id)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    postIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}

const handleGetPostsFailure = (
  state: any,
  action: { payload: { error: any } },
) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
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

const handleBlockUserRequest = (state: any, action: any) => {
  return update(state, {
    blockUserSuccess: { $set: false },
    blockType: { $set: '' },
    loading: { $set: true },
    error: { $set: null },
  })
}
const handleBlockUserSuccess = (state: any, action: any) => {
  const {
    result: { message },
  } = action.payload
  const blockType =
    message.toLowerCase() == 'user unblocked' ? 'unblock' : 'block'

  return update(state, {
    blockUserSuccess: { $set: true },
    blockType: { $set: blockType },
    loading: { $set: false },
    error: { $set: null },
  })
}

const handleBlockUserFailure = (state: any, action: any) => {
  return update(state, {
    blockUserSuccess: { $set: false },
    blockType: { $set: '' },
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const homeReducer = createReducer(initialState, {
  [ActionTypes.GET_POSTS_REQUEST]: handleGetPostsRequest,
  [ActionTypes.GET_POSTS_SUCCESS]: handleGetPostsSuccess,
  [ActionTypes.GET_POSTS_FAILURE]: handleGetPostsFailure,

  [ActionTypes.DELETE_POST_REQUEST]: handleDeletePostRequest,
  [ActionTypes.DELETE_POST_SUCCESS]: handleDeletePostSuccess,
  [ActionTypes.DELETE_POST_FAILURE]: handleDeletePostFailure,

  [ActionTypes.BLOCK_USER_REQUEST]: handleBlockUserRequest,
  [ActionTypes.BLOCK_USER_SUCCESS]: handleBlockUserSuccess,
  [ActionTypes.BLOCK_USER_FAILURE]: handleBlockUserFailure,
})

export default homeReducer

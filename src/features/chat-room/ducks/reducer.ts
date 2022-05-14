import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { findIndex } from 'lodash'

import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import {
  SOCKET_CHAT_MESSAGE,
  SOCKET_DELETE_MESSAGE,
  SOCKET_IS_TYPING,
} from 'sagas/action-types'

const initialState = {
  chatMessageIds: [],
  loading: false,
  error: null,
  pagination: {
    skip: 0,
    endReached: false,
  },
  chatRoomId: null,
  isTyping: false,
}

const handleGetChatMessageRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: action.payload.skip },
    },
  })
}

const handleGetChatMessagesSuccess = (state: any, action: any) => {
  const ids = action.payload.result.map((chatMessage: any) => chatMessage._id)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    chatMessageIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}

const handleGetChatMessagesFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleCreateChatRoomRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleCreateChatRoomSuccess = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    chatRoomId: { $set: action.payload.result._id },
  })
}

const handleCreateChatRoomFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: action.payload.error },
  })
}

const handleGetChatRoomOfMessageRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    chatRoomId: { $set: null },
  })
}

const handleGetChatRoomOfMessageSuccess = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    chatRoomId: { $set: action.payload.result._id },
  })
}

const handleGetChatRoomOfMessageFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: action.payload.error },
    chatRoomId: { $set: null },
  })
}

const handleReceivedSocketChatMessage = (state: any, action: any) => {
  return update(state, {
    chatMessageIds: { $unshift: [action.payload.chatMessage._id] },
  })
}

const handleIsTypingChanged = (state: any, action: any) => {
  return update(state, {
    isTyping: { $set: action.payload.isTyping },
  })
}

const handleChatRoomActionRequest = (state: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleChatRoomActionSuccess = (state: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: null },
  })
}

const handleChatRoomActionFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleReceivedSocketDeleteMessage = (state: any, action: any) => {
  const { messageId } = action.payload

  const deletedIndex = findIndex(state.chatMessageIds, function (id) {
    return id === messageId
  })

  return update(state, {
    chatMessageIds: { $splice: [[deletedIndex, 1]] },
  })
}

const handleDeleteChatRoomSuccess = (state: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    chatMessageIds: { $set: [] },
    chatRoomId: { $set: null },
  })
}

const chatRoomReducer = createReducer(initialState, {
  [ActionTypes.GET_CHAT_MESSAGES_REQUEST]: handleGetChatMessageRequest,
  [ActionTypes.GET_CHAT_MESSAGES_SUCCESS]: handleGetChatMessagesSuccess,
  [ActionTypes.GET_CHAT_MESSAGES_FAILURE]: handleGetChatMessagesFailure,

  [ActionTypes.CREATE_CHAT_ROOM_REQUEST]: handleCreateChatRoomRequest,
  [ActionTypes.CREATE_CHAT_ROOM_SUCCESS]: handleCreateChatRoomSuccess,
  [ActionTypes.CREATE_CHAT_ROOM_FAILURE]: handleCreateChatRoomFailure,

  [SOCKET_CHAT_MESSAGE]: handleReceivedSocketChatMessage,
  [SOCKET_IS_TYPING]: handleIsTypingChanged,
  [SOCKET_DELETE_MESSAGE]: handleReceivedSocketDeleteMessage,

  [ActionTypes.PUT_ACTION_CHAT_ROOM_REQUEST]: handleChatRoomActionRequest,
  [ActionTypes.PUT_ACTION_CHAT_ROOM_SUCCESS]: handleChatRoomActionSuccess,
  [ActionTypes.PUT_ACTION_CHAT_ROOM_FAILURE]: handleChatRoomActionFailure,

  [ActionTypes.DELETE_CHAT_ROOM_SUCCESS]: handleDeleteChatRoomSuccess,
  [ActionTypes.GET_CHAT_ROOM_OF_MESSAGE_REQUEST]: handleGetChatRoomOfMessageRequest,
  [ActionTypes.GET_CHAT_ROOM_OF_MESSAGE_SUCCESS]: handleGetChatRoomOfMessageSuccess,
  [ActionTypes.GET_CHAT_ROOM_OF_MESSAGE_FAILURE]: handleGetChatRoomOfMessageFailure,
})

export default chatRoomReducer

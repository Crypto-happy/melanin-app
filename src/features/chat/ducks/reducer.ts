import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import * as ChattRoomActionTypes from '../../chat-room/ducks/action-types'
import update from 'immutability-helper'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import { DELETE_CHAT_ROOM_SUCCESS } from '../../chat-room/ducks/action-types'

const initialState = {
  chatRoomIds: [],
  loading: false,
  error: null,
  pagination: {
    skip: 0,
    endReached: false,
  },
}

const handleGetChatRoomsRequest = (state: any, action: any) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleGetChatRoomsSuccess = (state: any, action: any) => {
  const ids = action.payload.result.map((chatRoom: any) => chatRoom._id)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    chatRoomIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}

const handleGetChatRoomsFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleDeleteChatRoomsSuccess = (state: any, action: any) => {
  const { roomId } = action.payload
  const { chatRoomIds } = state

  const newChatRoomIds = chatRoomIds.filter(
    (chatRoomId: any) => chatRoomId !== roomId,
  )

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    chatRoomIds: {
      $set: newChatRoomIds,
    },
    pagination: {
      endReached: { $set: newChatRoomIds.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}

const chatReducer = createReducer(initialState, {
  [ActionTypes.GET_CHAT_ROOMS_REQUEST]: handleGetChatRoomsRequest,
  [ActionTypes.GET_CHAT_ROOMS_SUCCESS]: handleGetChatRoomsSuccess,
  [ActionTypes.GET_CHAT_ROOMS_FAILURE]: handleGetChatRoomsFailure,
  [DELETE_CHAT_ROOM_SUCCESS]: handleDeleteChatRoomsSuccess,
})

export default chatReducer

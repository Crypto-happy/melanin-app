import * as ActionTypes from './action-types'

export const getChatRoomsRequest = (
  skip: number,
  limit: number,
  searchText: string,
) => ({
  type: ActionTypes.GET_CHAT_ROOMS_REQUEST,
  payload: {
    skip,
    limit,
    searchText,
  },
  showLoading: true,
})

export const getChatRoomsSuccess = (result: any) => ({
  type: ActionTypes.GET_CHAT_ROOMS_SUCCESS,
  payload: {
    result,
  },
  showLoading: false,
})

export const getChatRoomsFailure = (error: any) => ({
  type: ActionTypes.GET_CHAT_ROOMS_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const joinChatRooms = (chatRoomIds: string[]) => ({
  type: ActionTypes.JOIN_CHAT_ROOMS,
  payload: {
    chatRoomIds,
  },
})

export const markChatRoomRead = (chatRoomId: string, read: number) => ({
  type: ActionTypes.MARK_CHAT_ROOM_READ,
  payload: {
    chatRoomId,
    read,
  },
})

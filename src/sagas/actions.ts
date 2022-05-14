import * as ActionTypes from './action-types'

export const rehydrationComplete = () => ({
  type: ActionTypes.REHYDRATION_COMPLETE,
})

export const sessionExpired = () => ({
  type: ActionTypes.SESSION_EXPIRED,
})

export const connectToSocketRequest = () => ({
  type: ActionTypes.SOCKET_CONNECT_REQUEST,
})

export const disconnectSocketRequest = () => ({
  type: ActionTypes.SOCKET_DISCONNECT_REQUEST,
})

export const connectToSocketSuccess = () => ({
  type: ActionTypes.SOCKET_CONNECT_SUCCESS,
})

export const connectToSocketFailure = () => ({
  type: ActionTypes.SOCKET_CONNECT_FAILURE,
})

export const socketDisconnected = () => ({
  type: ActionTypes.SOCKET_DISCONNECTED,
})

export const receivedSocketChatMessage = (chatMessage: any) => ({
  type: ActionTypes.SOCKET_CHAT_MESSAGE,
  payload: {
    chatMessage,
  },
})

export const receivedSocketDeleteMessage = (messageId: any) => ({
  type: ActionTypes.SOCKET_DELETE_MESSAGE,
  payload: {
    messageId,
  },
})

export const socketIsTypingChanged = (isTyping: boolean) => ({
  type: ActionTypes.SOCKET_IS_TYPING,
  payload: {
    isTyping,
  },
})

export const getUnreadsRequest = () => ({
  type: ActionTypes.GET_UNREADS_REQUEST,
})

export const getUnreadsSuccess = (result: any) => ({
  type: ActionTypes.GET_UNREADS_SUCCESS,
  payload: { result },
})

export const getUnreadsFailure = (error: any) => ({
  type: ActionTypes.GET_UNREADS_FAILURE,
  payload: { error },
})

export const getAllCategoryRequest = () => ({
  type: ActionTypes.GET_ALL_CATEGORIES_REQUEST,
  showLoading: true,
})

export const getAllCategorySuccess = (results: any) => ({
  type: ActionTypes.GET_ALL_CATEGORIES_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const getAllCategoryFailure = (error: any) => ({
  type: ActionTypes.GET_ALL_CATEGORIES_FAILURE,
  payload: { error },
  showLoading: false,
})

import * as ActionTypes from './action-types'
import { CHAT_ROOM_ACTION } from 'constants'

export const emitChatMessage = (chatMessage: any) => ({
  type: ActionTypes.EMIT_CHAT_MESSAGE,
  payload: chatMessage,
})

export const emitDeleteChatMessage = (message: any) => ({
  type: ActionTypes.EMIT_DELETE_MESSAGE,
  payload: message,
})

export const getChatMessagesRequest = (
  chatRoomId: string,
  skip: number,
  limit: number,
) => ({
  type: ActionTypes.GET_CHAT_MESSAGES_REQUEST,
  payload: {
    chatRoomId,
    skip,
    limit,
  },
})

export const getChatMessagesSuccess = (result: any) => ({
  type: ActionTypes.GET_CHAT_MESSAGES_SUCCESS,
  payload: {
    result,
  },
})

export const getChatMessagesFailure = (error: any) => ({
  type: ActionTypes.GET_CHAT_MESSAGES_FAILURE,
  payload: {
    error,
  },
})

export const createChatRoomRequest = (userId: string) => ({
  type: ActionTypes.CREATE_CHAT_ROOM_REQUEST,
  payload: {
    userId,
  },
})

export const createChatRoomSuccess = (result: any) => ({
  type: ActionTypes.CREATE_CHAT_ROOM_SUCCESS,
  payload: {
    result,
  },
})

export const createChatRoomFailure = (error: any) => ({
  type: ActionTypes.CREATE_CHAT_ROOM_FAILURE,
  payload: {
    error,
  },
})

export const getChatRoomOfMessageRequest = (messageId: string) => ({
  type: ActionTypes.GET_CHAT_ROOM_OF_MESSAGE_REQUEST,
  payload: {
    messageId,
  },
})

export const getChatRoomOfMessageSuccess = (result: any) => ({
  type: ActionTypes.GET_CHAT_ROOM_OF_MESSAGE_SUCCESS,
  payload: {
    result,
  },
})

export const getChatRoomOfMessageFailure = (error: any) => ({
  type: ActionTypes.GET_CHAT_ROOM_OF_MESSAGE_FAILURE,
  payload: {
    error,
  },
})

export const emitIsTyping = (isTyping: boolean, roomId: string) => ({
  type: ActionTypes.EMIT_IS_TYPING,
  payload: {
    isTyping,
    roomId,
  },
})

export const emitImagesMessage = (attachments: any[], roomId: string) => ({
  type: ActionTypes.EMIT_IMAGES_MESSAGE,
  payload: { attachments, roomId },
})

export const emitAudioMessage = (audio: any, roomId: string) => ({
  type: ActionTypes.EMIT_AUDIO_MESSAGE,
  payload: { audio, roomId },
})

export const blockChatRoom = (roomId: string = '') => ({
  type: ActionTypes.PUT_ACTION_CHAT_ROOM_REQUEST,
  payload: {
    roomId,
    roomActionType: CHAT_ROOM_ACTION.BLOCK,
  },
})

export const allowChatRoom = (roomId: string = '') => ({
  type: ActionTypes.PUT_ACTION_CHAT_ROOM_REQUEST,
  payload: {
    roomId,
    roomActionType: CHAT_ROOM_ACTION.ALLOW,
  },
})

export const muteChatRoom = (roomId: string = '') => ({
  type: ActionTypes.PUT_ACTION_CHAT_ROOM_REQUEST,
  payload: {
    roomId,
    roomActionType: CHAT_ROOM_ACTION.MUTE,
  },
})

export const deleteChatRoom = (roomId: string = '') => ({
  type: ActionTypes.PUT_ACTION_CHAT_ROOM_REQUEST,
  payload: {
    roomId,
    roomActionType: CHAT_ROOM_ACTION.DELETE,
  },
})

export const doActionOnChatRoomSuccess = (result: any) => ({
  type: ActionTypes.PUT_ACTION_CHAT_ROOM_SUCCESS,
  payload: {
    result,
  },
})

export const doActionOnChatRoomFailure = (error: any) => ({
  type: ActionTypes.PUT_ACTION_CHAT_ROOM_FAILURE,
  payload: {
    error,
  },
})

export const deleteChatRoomSuccess = (roomId: any) => ({
  type: ActionTypes.DELETE_CHAT_ROOM_SUCCESS,
  payload: {
    roomId,
  },
})

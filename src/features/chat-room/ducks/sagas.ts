import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  CREATE_CHAT_ROOM_REQUEST,
  EMIT_AUDIO_MESSAGE,
  EMIT_CHAT_MESSAGE,
  EMIT_DELETE_MESSAGE,
  EMIT_IMAGES_MESSAGE,
  EMIT_IS_TYPING,
  GET_CHAT_MESSAGES_REQUEST,
  PUT_ACTION_CHAT_ROOM_REQUEST,
  GET_CHAT_ROOM_OF_MESSAGE_REQUEST,
} from 'features/chat-room/ducks/action-types'
import { chatMessagesApi, chatRoomsApi, uploadApi } from 'api'
import {
  createChatRoomFailure,
  createChatRoomSuccess,
  emitChatMessage,
  getChatMessagesFailure,
  getChatMessagesSuccess,
  doActionOnChatRoomSuccess,
  doActionOnChatRoomFailure,
  deleteChatRoomSuccess,
  getChatRoomOfMessageFailure,
  getChatRoomOfMessageSuccess,
} from 'features/chat-room/ducks/actions'
import Socket from 'services/socket'
import { CHAT_ROOM_ACTION, SOCKET_EVENT } from 'constants'
import { joinChatRooms } from 'features/chat/ducks/actions'

function* getChatMessages(action: any) {
  try {
    const { chatRoomId, skip, limit } = action.payload
    const result = yield call(
      chatMessagesApi.getChatMessages,
      chatRoomId,
      skip,
      limit,
    )
    yield put(getChatMessagesSuccess(result.data))
  } catch (error) {
    yield put(getChatMessagesFailure(error))
  }
}

function* handleEmitChatMessage(action: any) {
  const chatMessage = action.payload
  const socket = Socket.getInstance()
  socket.emit(SOCKET_EVENT.CHAT_MESSAGE, chatMessage)
}

function* handleEmitDeleteMessage(action: any) {
  try {
    const chatMessage = action.payload
    const socket = Socket.getInstance()
    socket.emit(SOCKET_EVENT.DELETE_MESSAGE, chatMessage)
  } catch (error) {
    console.log('Emit delete message failure', error)
  }
}

function* createChatRoom(action: any) {
  try {
    const { userId } = action.payload
    const result = yield call(chatRoomsApi.createChatRoom, userId)
    yield put(createChatRoomSuccess(result.data))
    const roomId = result.data._id
    yield put(joinChatRooms([roomId]))
  } catch (error) {
    yield put(createChatRoomFailure(error))
  }
}

function* emitIsTyping(action: any) {
  try {
    const { isTyping, roomId } = action.payload
    const socket = Socket.getInstance()
    socket.emit(SOCKET_EVENT.IS_TYPING, {
      isTyping,
      roomId,
    })
  } catch (error) {}
}

async function uploadAttachment(attachment: any) {
  const attachmentUploadResult = await uploadApi.upload(attachment)
  return {
    type: attachment.type,
    url: attachmentUploadResult.data,
  }
}

function* emitImagesMessage(action: any) {
  try {
    const { attachments = [], roomId } = action.payload
    const attachmentsPayload = yield all(
      attachments.map((attachment: any) => call(uploadAttachment, attachment)),
    )
    const chatMessage = {
      text: '',
      attachments: attachmentsPayload,
      chatRoom: roomId,
    }
    yield put(emitChatMessage(chatMessage))
  } catch (error) {}
}

function* emitAudioMessage(action: any) {
  try {
    const { audio = {}, roomId } = action.payload
    let attachmentPayload = yield call(uploadAttachment, audio)
    attachmentPayload.duration = audio.duration

    const chatMessage = {
      text: '',
      attachments: [attachmentPayload],
      chatRoom: roomId,
    }
    yield put(emitChatMessage(chatMessage))
  } catch (error) {
    console.log('attachment emitted > exception', error)
  }
}

function* putActionOnChatRoom(action: any) {
  try {
    const { roomId, roomActionType } = action.payload

    const result = yield call(
      chatRoomsApi.putActionOnChatRoom,
      roomId,
      roomActionType,
    )

    if (roomActionType === CHAT_ROOM_ACTION.DELETE) {
      yield put(deleteChatRoomSuccess(roomId))
    } else {
      yield put(doActionOnChatRoomSuccess(result.data))
    }
  } catch (error) {
    yield put(doActionOnChatRoomFailure(error.message))
  }
}

function* getChatRoomOfMessage(action: any) {
  try {
    const { messageId } = action.payload
    const result = yield call(chatRoomsApi.getChatRoomOfMessage, messageId)
    yield put(getChatRoomOfMessageSuccess(result.data))
    const roomId = result.data._id
    yield put(joinChatRooms([roomId]))
  } catch (error) {
    yield put(getChatRoomOfMessageFailure(error))
  }
}

function* chatRoomSaga() {
  yield takeLatest(GET_CHAT_MESSAGES_REQUEST, getChatMessages)
  yield takeLatest(EMIT_CHAT_MESSAGE, handleEmitChatMessage)
  yield takeLatest(EMIT_DELETE_MESSAGE, handleEmitDeleteMessage)
  yield takeLatest(CREATE_CHAT_ROOM_REQUEST, createChatRoom)
  yield takeLatest(EMIT_IS_TYPING, emitIsTyping)
  yield takeLatest(EMIT_IMAGES_MESSAGE, emitImagesMessage)
  yield takeLatest(EMIT_AUDIO_MESSAGE, emitAudioMessage)
  yield takeLatest(PUT_ACTION_CHAT_ROOM_REQUEST, putActionOnChatRoom)
  yield takeLatest(GET_CHAT_ROOM_OF_MESSAGE_REQUEST, getChatRoomOfMessage)
}

export default chatRoomSaga

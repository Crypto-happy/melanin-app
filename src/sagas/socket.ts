import { eventChannel } from 'redux-saga'
import Config from 'react-native-config'

import { SOCKET_EVENT } from 'constants'
import {
  SOCKET_CONNECT_REQUEST,
  SOCKET_DISCONNECT_REQUEST,
} from 'sagas/action-types'
import {
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  take,
} from 'redux-saga/effects'
import {
  connectToSocketFailure,
  connectToSocketSuccess,
  receivedSocketChatMessage,
  receivedSocketDeleteMessage,
  socketDisconnected,
  socketIsTypingChanged,
} from 'sagas/actions'
import Socket from 'services/socket'
import { LOGOUT_REQUEST } from 'features/settings/ducks/action-types'

function* createSocketChannel(socket: any) {
  return eventChannel((emit: any) => {
    socket.on(SOCKET_EVENT.CONNECT_SUCCESS, () => {
      emit({
        type: SOCKET_EVENT.CONNECT_SUCCESS,
      })
    })

    socket.on(SOCKET_EVENT.CONNECT_FAILURE, (error: any) => {
      emit({
        type: SOCKET_EVENT.CONNECT_FAILURE,
        payload: error,
      })
    })

    socket.on(SOCKET_EVENT.DISCONNECTED, () => {
      emit({
        type: SOCKET_EVENT.DISCONNECTED,
      })
    })

    socket.on(SOCKET_EVENT.CHAT_MESSAGE, (message: any) => {
      emit({
        type: SOCKET_EVENT.CHAT_MESSAGE,
        payload: message,
      })
    })

    socket.on(SOCKET_EVENT.DELETE_MESSAGE, (message: any) => {
      emit({
        type: SOCKET_EVENT.DELETE_MESSAGE,
        payload: message,
      })
    })

    socket.on(SOCKET_EVENT.IS_TYPING, (isTyping: boolean) => {
      emit({
        type: SOCKET_EVENT.IS_TYPING,
        payload: isTyping,
      })
    })

    const unsubcribe = () => {
      socket.disconnect(true)
    }

    return unsubcribe
  })
}

function* handleSocketConnection() {
  yield delay(500)
  const socket = Socket.getInstance()
  const socketChannel = yield call(createSocketChannel, socket)
  try {
    while (true) {
      const event = yield take(socketChannel)
      const { type, payload } = event

      switch (type) {
        case SOCKET_EVENT.CONNECT_SUCCESS:
          yield put(connectToSocketSuccess())
          break

        case SOCKET_EVENT.CONNECT_FAILURE:
          yield put(connectToSocketFailure())
          break

        case SOCKET_EVENT.DISCONNECTED:
          yield put(socketDisconnected())
          break

        case SOCKET_EVENT.CHAT_MESSAGE:
          yield put(receivedSocketChatMessage(payload))
          break

        case SOCKET_EVENT.DELETE_MESSAGE:
          yield put(receivedSocketDeleteMessage(payload))
          break

        case SOCKET_EVENT.IS_TYPING:
          yield put(socketIsTypingChanged(payload))
          break
      }
    }
  } finally {
    if (yield cancelled()) {
      socketChannel.close()
      socket.disconnect()
    }
  }
}

function* socketSaga() {
  if (Config.APP_ENV === 'proDucTion') {
    while (true) {
      yield take(SOCKET_CONNECT_REQUEST)
      const handleSocketTask = yield fork(handleSocketConnection)

      yield take([SOCKET_DISCONNECT_REQUEST, LOGOUT_REQUEST])
      yield cancel(handleSocketTask)
    }
  }

  console.log('Run on development')
}

export default socketSaga

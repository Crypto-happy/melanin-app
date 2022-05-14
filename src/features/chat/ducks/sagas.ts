import { chatRoomsApi, unreadsApi } from 'api'
import { call, put, takeLatest, select } from 'redux-saga/effects'
import {
  getChatRoomsFailure,
  getChatRoomsSuccess,
  joinChatRooms,
} from 'features/chat/ducks/actions'
import {
  GET_CHAT_ROOMS_REQUEST,
  GET_CHAT_ROOMS_SUCCESS,
  JOIN_CHAT_ROOMS,
} from 'features/chat/ducks/action-types'
import { getUnreadsSuccess } from 'sagas/actions'
import Socket from 'services/socket'
import { SOCKET_EVENT } from 'constants'
import { SOCKET_CONNECT_SUCCESS } from 'sagas/action-types'
import { isEmpty } from 'lodash'

function* getChatRooms(action: any) {
  try {
    const {
      payload: { skip, limit, searchText },
    } = action

    const res = yield call(chatRoomsApi.getChatRooms, skip, limit, searchText)
    yield put(getChatRoomsSuccess(res.data))

    const unreadRes = yield call(unreadsApi.getUnreads)
    yield put(getUnreadsSuccess(unreadRes.data))
  } catch (error) {
    yield put(getChatRoomsFailure(error))
  }
}

function* handleGetChatRoomsSuccess(action: any) {
  const { result } = action.payload
  const chatRoomIds: string[] = result.map((chatRoom: any) => chatRoom._id)
  yield put(joinChatRooms(chatRoomIds))
}

function* handleJoinChatRooms(action: any) {
  try {
    const { chatRoomIds } = action.payload
    const socket = Socket.getInstance()
    socket.emit(SOCKET_EVENT.JOIN, {
      roomIds: chatRoomIds,
    })
  } catch (error) {}
}

function* handleConnectToSocketSuccess(action: any) {
  const chatRoomIds = yield select((state) => state.chat.chatRoomIds)
  if (!isEmpty(chatRoomIds)) {
    yield put(joinChatRooms(chatRoomIds))
  }
}

function* chatSaga() {
  yield takeLatest(GET_CHAT_ROOMS_REQUEST, getChatRooms)
  yield takeLatest(GET_CHAT_ROOMS_SUCCESS, handleGetChatRoomsSuccess)
  yield takeLatest(JOIN_CHAT_ROOMS, handleJoinChatRooms)
  yield takeLatest(SOCKET_CONNECT_SUCCESS, handleConnectToSocketSuccess)
}

export default chatSaga

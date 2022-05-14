import { call, put, takeLatest } from 'redux-saga/effects'
import {
  getUnreadsFailure,
  getUnreadsRequest,
  getUnreadsSuccess,
} from 'sagas/actions'
import { unreadsApi } from 'api'
import { GET_UNREADS_REQUEST, SOCKET_CHAT_MESSAGE } from './action-types'
import { LOGIN_SUCCESS } from 'features/login/ducks/action-types'

function* getUnread(action: any) {
  try {
    const res = yield call(unreadsApi.getUnreads)
    yield put(getUnreadsSuccess(res.data))
  } catch (error) {
    yield put(getUnreadsFailure(error))
  }
}

function* handleLoginSuccess() {
  yield put(getUnreadsRequest())
}

function* unreadsSaga() {
  yield takeLatest(GET_UNREADS_REQUEST, getUnread)
  yield takeLatest(LOGIN_SUCCESS, handleLoginSuccess)
  yield takeLatest(SOCKET_CHAT_MESSAGE, getUnread)
}

export default unreadsSaga

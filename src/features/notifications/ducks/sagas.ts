import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import {
  getNotificationsFailure,
  getNotificationsSuccess,
  makeNotificationsSeenSuccess,
  makeNotificationsSeenFailure,
} from './actions'
import { notificationsApi } from 'api'

function* getNotifications() {
  try {
    const res = yield call(notificationsApi.getNotifications)
    yield put(getNotificationsSuccess(res.data))
  } catch (error) {
    yield put(getNotificationsFailure(error))
  }
}

function* makeNotificationsSeen() {
  try {
    const res = yield call(notificationsApi.makeNotificationsSeen)
    yield put(makeNotificationsSeenSuccess(res.data))
  } catch (error) {
    yield put(makeNotificationsSeenFailure(error))
  }
}

function* notificationsSaga() {
  yield takeLatest(
    ActionTypes.GET_NOTIFICATIONS_REQUEST,
    getNotifications,
  )
  yield takeLatest(
    ActionTypes.SEEN_NOTIFICATIONS_REQUEST,
    makeNotificationsSeen,
  )
}

export default notificationsSaga

import { call, put, select, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { authApi } from '../../../api'
import { get } from 'lodash'
import { connectToSocketRequest } from 'sagas/actions'

function* login(action: any) {
  try {
    const { email, password } = action.payload
    const res = yield call(authApi.login, email, password)
    yield put(Actions.loginSuccess(res.data))
    const socketConnected = yield select((state) => state.socket.connected)
    if (!socketConnected) {
      yield put(connectToSocketRequest())
    }
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.loginFailure(err))
  }
}

function* loginFacebook(action: any) {
  try {
    const { userId, accessToken } = action.payload
    const res = yield call(authApi.loginFacebook, userId, accessToken)
    // First time Login with Facebook
    if (res.data.fbUser) {
      yield put(Actions.loginFacebookSuccess(res.data.fbUser))
    } else {
      yield put(Actions.loginSuccess(res.data))
    }
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.loginFacebookFailure(err))
  }
}

function* loginAppleId(action: any) {
  try {
    const { appleAuth } = action.payload
    const res = yield call(authApi.loginAppleId, appleAuth)
    // First time Login with Facebook
    if (res.data.appleUser) {
      yield put(Actions.loginAppleIdSuccess(res.data.appleUser))
    } else {
      yield put(Actions.loginSuccess(res.data))
    }
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.loginAppleIdFailure(err))
  }
}

function* loginSaga() {
  yield takeLatest(ActionTypes.LOGIN_REQUEST, login)
  yield takeLatest(ActionTypes.LOGIN_FACEBOOK_REQUEST, loginFacebook)
  yield takeLatest(ActionTypes.LOGIN_APPLE_ID_REQUEST, loginAppleId)
}

export default loginSaga

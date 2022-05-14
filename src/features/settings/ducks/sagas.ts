import { call, put, takeLatest } from 'redux-saga/effects'
import {
  LOGOUT_REQUEST,
  GET_USER_SETTING_REQUEST,
  UPDATE_USER_SETTING_REQUEST,
  GET_BLOCKED_USER_REQUEST,
} from './action-types'
import { authApi, profileApi } from 'api'
import {
  logoutFailure,
  logoutSuccess,
  getUserSettingSuccess,
  getUserSettingFailure,
  updateUserSettingSuccess,
  updateUserSettingFailure,
  blockedUserFailure,
  blockedUserSuccess,
} from './actions'

function* logout() {
  try {
    const result = yield call(authApi.logout)
    yield put(logoutSuccess(result))
  } catch (error) {
    yield put(logoutFailure(error))
  }
}

function* getUserSetting() {
  try {
    const siteUrlsResult = yield call(authApi.fetchSiteUrls)
    const result = yield call(profileApi.getUserSettingMe)
    yield put(getUserSettingSuccess(result, siteUrlsResult))
  } catch (error) {
    yield put(getUserSettingFailure(error))
  }
}

function* updateUserSetting(action: any) {
  try {
    const { settingObj } = action.payload
    const result = yield call(profileApi.updateUserSetting, settingObj)
    yield put(updateUserSettingSuccess(result))
  } catch (error) {
    yield put(updateUserSettingFailure(error))
  }
}

function* getBlockedUser(action: any) {
  try {
    const result = yield call(profileApi.gotBlockedUser)
    yield put(blockedUserSuccess(result))
  } catch (error) {
    yield put(blockedUserFailure(error))
  }
}

function* settingsSaga() {
  yield takeLatest(LOGOUT_REQUEST, logout)
  yield takeLatest(GET_USER_SETTING_REQUEST, getUserSetting)
  yield takeLatest(UPDATE_USER_SETTING_REQUEST, updateUserSetting)
  yield takeLatest(GET_BLOCKED_USER_REQUEST, getBlockedUser)
}

export default settingsSaga

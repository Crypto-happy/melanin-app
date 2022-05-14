import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { get } from 'lodash'
import { authApi } from 'api'

function* registerAccount(action: any) {
  try {
    const res = yield call(authApi.register, action.payload)
    yield put(Actions.registerAccountSuccess(res.data))
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.registerAccountFailure(err))
  }
}

function* fetchSiteUrls() {
  try {
    const res = yield call(authApi.fetchSiteUrls)
    yield put(Actions.getSiteUrlsSuccess(res.data))
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.getSiteUrlsFailure(err))
  }
}

function* registerSaga() {
  yield takeLatest(ActionTypes.REGISTER_ACCOUNT_REQUEST, registerAccount)
  yield takeLatest(ActionTypes.SITE_URLS_REQUEST, fetchSiteUrls)
}

export default registerSaga

import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { authApi } from '../../../api'
import { get } from 'lodash'

function* forgotPassword(action: any) {
  try {
    const { email } = action.payload
    const res = yield call(authApi.forgotPassword, email)
    yield put(Actions.forgotPasswordSuccess(res.data))
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.forgotPasswordFailure(err))
  }
}

function* forgotPasswordSaga() {
  yield takeLatest(ActionTypes.FORGOT_PASSWORD_REQUEST, forgotPassword)
}

export default forgotPasswordSaga

import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { authApi } from '../../../api'
import { get } from 'lodash'

function* resetPassword(action: any) {
  try {
    const { password, accessToken } = action.payload
    yield call(authApi.resetPassword, password, accessToken)
    yield put(Actions.resetPasswordSuccess())
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.resetPasswordFailure(err))
  }
}

function* resetPasswordSaga() {
  yield takeLatest(ActionTypes.RESET_PASSWORD_REQUEST, resetPassword)
}

export default resetPasswordSaga

import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { authApi } from '../../../api'
import { get } from 'lodash'

function* changePassword(action: any) {
  try {
    const { newPassword, oldPassword } = action.payload
    const res = yield call(authApi.changePassword, newPassword, oldPassword)
    yield put(Actions.changePasswordSuccess(res.data))
  } catch (error) {
    const err = get(error, 'response.data.error', null)
    yield put(Actions.changePasswordFailure(err))
  }
}

function* changePasswordSaga() {
  yield takeLatest(ActionTypes.CHANGE_PASSWORD_REQUEST, changePassword)
}

export default changePasswordSaga

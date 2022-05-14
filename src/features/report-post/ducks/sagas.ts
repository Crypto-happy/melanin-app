import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import { postsApi } from '../../../api'
import * as Actions from './actions'
import { get } from 'lodash'

function* reportPost(action: any) {
  try {
    const { id, reason } = action.payload
    const res = yield call(postsApi.reportPost, id, reason)
    yield put(Actions.reportPostSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'response.data.error.message', null)
    yield put(Actions.reportPostFailure(errMessage))
  }
}

function* reportPostSaga() {
  yield takeLatest(ActionTypes.REPORT_POST_REQUEST, reportPost)
}

export default reportPostSaga

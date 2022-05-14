import { put, select, takeEvery } from 'redux-saga/effects'
import { isNil } from 'lodash'
import * as Actions from './actions'

function* handleShowLoading(action) {
  const { showLoading } = action
  const requestCount = yield select((state) => state.loading.requestCount)

  if (requestCount === 0 && showLoading) {
    yield put(Actions.showLoadingIndicator())
  }

  if (!showLoading) {
    yield put(Actions.hideLoadingIndicator())
  }

  if (!showLoading && requestCount > 0) {
    yield put(Actions.decreaseLoadingRequest())
  }

  if (showLoading) {
    yield put(Actions.increaseLoadingRequest())
  }
}

function* loadingSaga() {
  yield takeEvery((action) => !isNil(action.showLoading), handleShowLoading)
}

export default loadingSaga

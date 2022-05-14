import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { directoriesApi } from 'api'
import { get } from 'lodash'

function* fetchDirectoriesBySearchRequest(action: any) {
  const { searchRequest, skip, limit } = action.payload

  try {
    const res = yield call(
      directoriesApi.getDirectoriesBySearchRequest,
      searchRequest.uniqueKey,
      searchRequest.location,
      searchRequest.minRating,
      searchRequest.maxRating,
      searchRequest.highViewOnly,
      skip,
      limit,
    )
    yield put(Actions.getDirectoriesBySearchSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getDirectoriesBySearchFailure(errMessage))
  }
}

function* directoryResultsSaga() {
  yield takeLatest(
    ActionTypes.GET_DIRECTORIES_BY_SEARCH_REQUEST,
    fetchDirectoriesBySearchRequest,
  )
}

export default directoryResultsSaga

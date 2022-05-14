import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { profileApi } from '../../../api'
import { get } from 'lodash'

function* fetchReviewsById(action: any) {
  try {
    const { targetId, skip, limit } = action.payload
    const res = yield call(profileApi.fetchReviewsById, targetId, skip, limit)
    yield put(Actions.getReviewsSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getReviewsFailure(errMessage))
  }
}

function* addNewReview(action: any) {
  try {
    const { targetId, text, rating } = action.payload
    const res = yield call(profileApi.postNewReview, targetId, text, rating)
    yield put(Actions.addNewReviewSuccess(res.data, targetId))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.addNewReviewFailure(errMessage))
  }
}

function* reviewsSaga() {
  yield takeLatest(ActionTypes.GET_REVIEWS_REQUEST, fetchReviewsById)
  yield takeLatest(ActionTypes.ADD_NEW_REVIEW_REQUEST, addNewReview)
}

export default reviewsSaga

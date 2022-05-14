import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { insightsApi } from '../../../api'
import { get } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

function* getCustomerReview(action: any) {
  try {
    const res = yield call(insightsApi.getCustomerReviews)
    yield put(Actions.getCustomerReviewSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getCustomerReviewFailure(errMessage))
  }
}

function* getProfileStats(action: any) {
  try {
    const { dropdownType } = action.payload
    const res = yield call(insightsApi.getProfileStats, dropdownType)
    yield put(Actions.getProfileStatsSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getProfileStatsFailure(errMessage))
  }
}

function* getTopPost(action: any) {
  try {
    const { skip, limit, type } = action.payload
    const res = yield call(insightsApi.getTopPosts, skip, limit, type)
    yield put(Actions.getTopPostsSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getTopPostsFailure(errMessage))
  }
}

function* getPageInteraction(action: any) {
  try {
    const { dropdownType } = action.payload
    const res = yield call(insightsApi.getPageInteractions, dropdownType)
    yield put(Actions.getPageInteractionSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getPageInteractionFailure(errMessage))
  }
}



function* insightsSaga() {
    yield takeLatest(ActionTypes.GET_CUSTOMER_REVIEW_REQUEST, getCustomerReview)
    yield takeLatest(ActionTypes.GET_PROFILE_STATS_REQUEST, getProfileStats)
    yield takeLatest(ActionTypes.GET_TOP_POST_REQUEST, getTopPost)
    yield takeLatest(ActionTypes.GET_PAGE_INTERACTION_REQUEST, getPageInteraction)
}
  
  export default insightsSaga
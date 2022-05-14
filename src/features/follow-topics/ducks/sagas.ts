import { call, put, takeLatest } from 'redux-saga/effects'
import { FOLLOW_TOPICS_REQUEST, GET_TOPICS_REQUEST } from './action-types'
import {
  followTopicsFailure,
  followTopicsSuccess,
  getTopicsFailure,
  getTopicsSuccess,
} from './actions'
import { topicsApi } from '../../../api'

function* getTopics() {
  try {
    const res = yield call(topicsApi.getTopics)
    yield put(getTopicsSuccess(res.data))
  } catch (error) {
    yield put(getTopicsFailure(error))
  }
}

function* followTopics(action: any) {
  try {
    const { topics } = action.payload
    const res = yield call(topicsApi.followTopics, topics)
    yield put(followTopicsSuccess(res.data.followedTopics))
  } catch (error) {
    yield put(followTopicsFailure(error))
  }
}

function* followTopicsSaga() {
  yield takeLatest(GET_TOPICS_REQUEST, getTopics)
  yield takeLatest(FOLLOW_TOPICS_REQUEST, followTopics)
}

export default followTopicsSaga

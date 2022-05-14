import { call, put, takeLatest } from 'redux-saga/effects'
import { sortBy } from 'lodash'
import { GET_FORUM_CATEGORIES_REQUEST } from './action-types'
import {
  getForumInterestCategoriesSuccess,
  getForumInterestCategoriesFailure,
} from './actions'
import { forumInterestsApi } from 'api'

function* getForumInterestCategories() {
  try {
    const res = yield call(forumInterestsApi.getForumInterestCategories)
    const sortedData = yield sortBy(res.data, ['name'])
    yield put(getForumInterestCategoriesSuccess(sortedData))
  } catch (error) {
    yield put(getForumInterestCategoriesFailure(error))
  }
}

function* selectInterestsSaga() {
  yield takeLatest(GET_FORUM_CATEGORIES_REQUEST, getForumInterestCategories)
}

export default selectInterestsSaga

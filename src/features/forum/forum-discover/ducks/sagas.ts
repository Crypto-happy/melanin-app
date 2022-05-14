import { call, put, takeEvery } from 'redux-saga/effects'
import { isEmpty } from 'lodash'
import { GET_FORUM_POSTS_REQUEST } from './action-types'
import { forumPostApi } from 'api'
import { getForumPostSuccess, getForumPostFailure } from './actions'
import {
  hideLoadingIndicator,
  showLoadingIndicator,
} from 'features/loading/ducks/actions'

function* getForumPosts(action: any) {
  try {
    yield put(showLoadingIndicator())
    const { id, limit, skip } = action.payload
    if (isEmpty(id)) {
      return
    }
    const res = yield call(forumPostApi.getForumPosts, id, limit, skip)
    yield put(getForumPostSuccess(id, res.data))
  } catch (error) {
    yield put(getForumPostFailure(error))
  } finally {
    yield put(hideLoadingIndicator())
  }
}

function* forumDiscoverSaga() {
  yield takeEvery(GET_FORUM_POSTS_REQUEST, getForumPosts)
}

export default forumDiscoverSaga

import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { postsApi, profileApi } from 'api'
import { first, get } from 'lodash'

function* fetchUserProfile(action: any) {
  const { userId } = action.payload

  try {
    const res = yield call(profileApi.getUserProfile, userId)
    yield put(Actions.getUserProfileSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getUserProfileFailure(userId, errMessage))
  }
}

function* fetchRatingPost(action: any) {
  const { userId = '' } = action.payload

  try {
    const ratingPostRes = yield call(profileApi.getUserRatingPosts, userId)
    yield put(
      Actions.getUserProfileRatingPostSuccess(first(ratingPostRes.data)),
    )
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getUserProfileRatingPostFailure(userId, errMessage))
  }
}

function* fetchPostsByAuthorId(action: any) {
  const { userId, skip, limit } = action.payload

  try {
    const res = yield call(postsApi.getPostsByUserId, userId, skip, limit)
    yield put(Actions.getPostsByAuthorIdSuccess(res.data, userId))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getPostsByAuthorIdFailure(errMessage, userId))
  }
}

function* userProfileSaga() {
  yield takeLatest(
    ActionTypes.GET_PUBLIC_USER_PROFILE_REQUEST,
    fetchUserProfile,
  )

  yield takeLatest(
    ActionTypes.GET_USER_PROFILE_RATING_POSTS_REQUEST,
    fetchRatingPost,
  )

  yield takeLatest(
    ActionTypes.GET_POSTS_BY_AUTHOR_ID_REQUEST,
    fetchPostsByAuthorId,
  )
}

export default userProfileSaga

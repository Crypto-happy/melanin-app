import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { categoriesApi, profileApi, postsApi } from 'api'
import { get, first } from 'lodash'

function* fetchMyProfile(action: any) {
  try {
    const res = yield call(profileApi.getMyProfile)
    yield put(Actions.getProfileSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getProfileFailure(errMessage))
  }
}

function* fetchRatingPost(action: any) {
  try {
    const { userId = '' } = action.payload
    const ratingPostRes = yield call(profileApi.getUserRatingPosts, userId)
    yield put(Actions.getProfileRatingPostSuccess(first(ratingPostRes.data)))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getProfileRatingPostFailure(errMessage))
  }
}

function* fetchPostsByAuthorId(action: any) {
  try {
    const { userId, skip, limit } = action.payload
    const res = yield call(postsApi.getPostsByUserId, userId, skip, limit)
    yield put(Actions.getPostsByAuthorIdSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getPostsByAuthorIdFailure(errMessage))
  }
}

function* getAllCategory() {
  try {
    const res = yield call(categoriesApi.fetchAllCategory)
    yield put(Actions.getAllCategorySuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getAllCategoryFailure(errMessage))
  }
}

function* profileSaga() {
  yield takeLatest(ActionTypes.GET_PROFILE_REQUEST, fetchMyProfile)

  yield takeLatest(
    ActionTypes.GET_PROFILE_RATING_POSTS_REQUEST,
    fetchRatingPost,
  )

  yield takeLatest(
    ActionTypes.GET_POSTS_BY_AUTHOR_ID_REQUEST,
    fetchPostsByAuthorId,
  )

  yield takeLatest(ActionTypes.PROFILE_GET_ALL_CATEGORY_REQUEST, getAllCategory)
}

export default profileSaga

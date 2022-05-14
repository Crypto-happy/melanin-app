import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { getPostsRequest } from './actions'
import { authApi, postsApi } from 'api'
import { get } from 'lodash'
import {
  SHARE_POST_FAILURE,
  SHARE_POST_SUCCESS,
} from 'features/post-details/ducks/action-types'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants/index'
import { constructPostsFromData } from 'utils/post.utils'

function* getPosts(action: any) {
  try {
    const { skip, limit } = action.payload
    const res = yield call(postsApi.getPosts, skip, limit)
    const posts = yield call(constructPostsFromData, res.data)
    yield put(Actions.getPostsSuccess(posts))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getPostsFailure(errMessage))
  }
}

function* likePost(action: any) {
  try {
    const postId = action.payload.id
    const res = yield call(postsApi.likePost, postId)
    yield put(Actions.likePostSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.likePostFailure(errMessage))
  }
}

function* dislikePost(action: any) {
  try {
    const postId = action.payload.id
    const res = yield call(postsApi.dislikePost, postId)
    yield put(Actions.dislikePostSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.dislikePostFailure(errMessage))
  }
}

function* ratePost(action: any) {
  try {
    const { id, rating } = action.payload
    const res = yield call(postsApi.ratePost, id, rating)
    yield put(Actions.ratePostSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.ratePostFailure(errMessage))
  }
}

function* sharePostCompleted(action: any) {
  try {
    yield put(getPostsRequest(0, DEFAULT_ITEMS_PER_PAGE))
  } catch (error) {}
}

function* deletePost(action: any) {
  try {
    const { id } = action.payload
    const res = yield call(postsApi.deletePost, id)
    yield put(Actions.deletePostSuccess(res.data, id))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.deletePostFailure(errMessage))
  }
}

function* blockUser(action: any) {
  try {
    const { id } = action.payload
    const res = yield call(authApi.blockUser, id)
    yield put(Actions.blockUserSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.blockUserFailure(errMessage))
  }
}

function* homeSaga() {
  yield takeLatest(ActionTypes.GET_POSTS_REQUEST, getPosts)
  yield takeLatest(ActionTypes.LIKE_POST_REQUEST, likePost)
  yield takeLatest(ActionTypes.DISLIKE_POST_REQUEST, dislikePost)
  yield takeLatest(ActionTypes.RATE_POST_REQUEST, ratePost)
  yield takeLatest([SHARE_POST_SUCCESS, SHARE_POST_FAILURE], sharePostCompleted)
  yield takeLatest(ActionTypes.DELETE_POST_REQUEST, deletePost)
  yield takeLatest(ActionTypes.BLOCK_USER_REQUEST, blockUser)
}

export default homeSaga

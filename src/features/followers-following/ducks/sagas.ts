import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { profileApi } from '../../../api'
import { get } from 'lodash'

function* getFollowers(action: any) {
  try {
    const { userId } = action.payload
    const res = yield call(profileApi.getUserFollowers, userId)
    yield put(Actions.getFollowersSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getFollowersFailure(errMessage))
  }
}

function* getFollowings(action: any) {
  try {
    const { userId } = action.payload
    const res = yield call(profileApi.getUserFollowings, userId)
    yield put(Actions.getFollowingsSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getFollowingsFailure(errMessage))
  }
}

function* followUser(action: any) {
  try {
    const { userId } = action.payload
    const res = yield call(profileApi.followUserById, userId)
    yield put(Actions.followUserSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.followUserFailure(errMessage))
  }
}

function* followerFollowingSaga() {
  yield takeLatest(ActionTypes.GET_FOLLOWERS_REQUEST, getFollowers)
  yield takeLatest(ActionTypes.GET_FOLLOWINGS_REQUEST, getFollowings)
  yield takeLatest(ActionTypes.FOLLOW_USER_BY_ID_REQUEST, followUser)
}

export default followerFollowingSaga

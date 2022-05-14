import { call, put, takeLatest, all } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { exploreApi } from '../../../api'
import { get } from 'lodash'

function* recommendedProfiles(action: any) {
  try {
    const { userId, skip, limit, filterMin, filterMax } = action.payload
    const res = yield call(
      exploreApi.fetchRecommendedProfiles,
      userId,
      skip,
      limit,
      filterMin,
      filterMax,
    )
    yield put(Actions.recommendedProfilesSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.recommendedProfilesFailure(errMessage))
  }
}

function* topRankedBusinesses(action: any) {
  try {
    const { userId, skip, limit, filterMin, filterMax } = action.payload

    const res = yield call(
      exploreApi.fetchTopRatedBusinesses,
      userId,
      skip,
      limit,
      filterMin,
      filterMax,
    )
    yield put(Actions.topRankedBusinessesSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.topRankedBusinessesFailure(errMessage))
  }
}

function* featuredVideos(action: any) {
  try {
    const { userId, skip, limit, filterMin, filterMax } = action.payload

    const res = yield call(
      exploreApi.fetchFeaturedVideos,
      userId,
      skip,
      limit,
      filterMin,
      filterMax,
    )
    yield put(Actions.featuredVideosSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.featuredVideosFailure(errMessage))
  }
}

function* featuredPhotos(action: any) {
  try {
    const { userId, skip, limit, filterMin, filterMax } = action.payload

    const res = yield call(
      exploreApi.fetchFeaturedPhotos,
      userId,
      skip,
      limit,
      filterMin,
      filterMax,
    )
    yield put(Actions.featuredPhotosSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.featuredPhotosFailure(errMessage))
  }
}

function* exploreSaga() {
  yield takeLatest(ActionTypes.RECOMMENDED_PROFILES, recommendedProfiles)

  yield takeLatest(ActionTypes.TOP_RANKED_BUSINESSES, topRankedBusinesses)

  yield takeLatest(ActionTypes.FEATURED_VIDEOS, featuredVideos)

  yield takeLatest(ActionTypes.FEATURED_PHOTOS, featuredPhotos)
}

export default exploreSaga

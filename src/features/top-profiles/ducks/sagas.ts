import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { exploreApi } from '../../../api'
import { get } from 'lodash'

function* getRecommend(action: any) {
  try {
    const { skip, limit, filterMin, filterMax, profileTypes } = action.payload

    const topProfileRes = yield call(
      exploreApi.fetchTopProfiles,
      skip,
      limit,
      profileTypes,
      filterMin,
      filterMax,
    )

    const [profiles] = topProfileRes.data

    yield put(Actions.recommendedProfilesAndTopRankedBusinessSuccess(profiles))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(
      Actions.recommendedProfilesAndTopRankedBusinessFailure(errMessage),
    )
  }
}

function* topProfilesSaga() {
  yield takeLatest(
    ActionTypes.RECOMMENDED_PROFILES_TOP_RANKED_BUSINESSES_OR_PERSONAL,
    getRecommend,
  )
}

export default topProfilesSaga

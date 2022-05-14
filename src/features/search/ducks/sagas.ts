import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { userListApi, postsApi, exploreApi } from '../../../api'
import { get, isEmpty } from 'lodash'

function* getUserListing(action: any) {
  try {
    const { skip, limit, search } = action.payload

    const hasNoSearching = isEmpty(search)
    const api = hasNoSearching
      ? exploreApi.fetchFollows
      : userListApi.getUserList

    const res = yield call(api, skip, limit, search)
    yield put(Actions.getUserListSuccess(res.data, hasNoSearching))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getUserListFailure(errMessage))
  }
}

function* getSearchPosts(action: any) {
  try {
    const { skip, limit, search } = action.payload

    const hasNoSearching = isEmpty(search)
    const api = hasNoSearching
      ? exploreApi.fetchCommunityPosts
      : postsApi.getPosts

    const res = yield call(api, skip, limit, search)
    yield put(Actions.getPostsSuccess(res.data, hasNoSearching))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getPostsFailure(errMessage))
  }
}

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

    const [profiles, businessProfiles] = topProfileRes.data

    yield put(
      Actions.recommendedProfilesAndTopRankedBusinessSuccess(
        profiles,
        businessProfiles,
      ),
    )
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(
      Actions.recommendedProfilesAndTopRankedBusinessFailure(errMessage),
    )
  }
}

function* getMedia(action: any) {
  try {
    const { skip, limit } = action.payload

    const mediaRes = yield call(exploreApi.fetchMedias, skip, limit)

    yield put(Actions.featuredMediaSuccess(mediaRes.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.featuredMediaFailure(errMessage))
  }
}

function* searchSaga() {
  yield takeLatest(ActionTypes.GET_USERLIST_REQUEST, getUserListing)
  yield takeLatest(ActionTypes.GET_SEARCH_POSTS_REQUEST, getSearchPosts)
  yield takeLatest(
    ActionTypes.RECOMMENDED_PROFILES_AND_TOP_RANKED_BUSINESSES,
    getRecommend,
  )
  yield takeLatest(ActionTypes.FEATURED_MEDIA, getMedia)
}

export default searchSaga

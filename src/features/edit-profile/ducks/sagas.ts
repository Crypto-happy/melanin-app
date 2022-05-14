import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { directoriesApi, profileApi, uploadApi, regionApi } from '../../../api'
import { get } from 'lodash'

function* updateProfile(action: any) {
  try {
    const { newInfo, attachment, uploadProgressHandler } = action.payload
    if (attachment) {
      const uploadResult = yield call(
        uploadApi.upload,
        attachment,
        uploadProgressHandler,
      )
      newInfo.avatarUrl = uploadResult.data
    }

    const res = yield call(profileApi.updateMyProfile, newInfo)
    yield put(Actions.updateProfileSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.updateProfileFailure(errMessage))
  }
}

function* getCountriesRequest() {
  try {
    const res = yield call(regionApi.getCountries)
    yield put(Actions.getCountrySuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getCountryFailure(errMessage))
  }
}

function* getStatesRequest(action: any) {
  const { countryId } = action.payload
  try {
    const res = yield call(regionApi.getStates, countryId)
    yield put(Actions.getStateSuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getStateFailure(errMessage))
  }
}

function* getCitiesRequest(action: any) {
  const { stateId } = action.payload
  try {
    const res = yield call(regionApi.getCities, stateId)
    yield put(Actions.getCitySuccess(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.getCityFailure(errMessage))
  }
}

function* editProfileSaga() {
  yield takeLatest(
    ActionTypes.EDIT_PROFILE_UPDATE_PROFILE_REQUEST,
    updateProfile,
  )
  yield takeLatest(
    ActionTypes.EDIT_PROFILE_GET_COUNTRY_REQUEST,
    getCountriesRequest,
  )
  yield takeLatest(ActionTypes.EDIT_PROFILE_GET_STATE_REQUEST, getStatesRequest)
  yield takeLatest(ActionTypes.EDIT_PROFILE_GET_CITY_REQUEST, getCitiesRequest)
}

export default editProfileSaga

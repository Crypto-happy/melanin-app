import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import {
  getBusinessCategoriesFailure,
  getBusinessCategoriesSuccess,
} from './actions'
import { businessCategoriesApi } from 'api'

function* getBusinessCategories() {
  try {
    const res = yield call(businessCategoriesApi.getBusinessCategories)
    yield put(getBusinessCategoriesSuccess(res.data))
  } catch (error) {
    yield put(getBusinessCategoriesFailure(error))
  }
}

function* businessCategoriesSaga() {
  yield takeLatest(
    ActionTypes.GET_BUSINESS_CATEGORIES_REQUEST,
    getBusinessCategories,
  )
}

export default businessCategoriesSaga

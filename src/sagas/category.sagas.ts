import { call, put, takeLatest } from 'redux-saga/effects'
import { getAllCategorySuccess, getAllCategoryFailure } from 'sagas/actions'
import { categoriesApi } from 'api'
import { GET_ALL_CATEGORIES_REQUEST, SOCKET_CHAT_MESSAGE } from './action-types'

function* getAllCategory() {
  try {
    const res = yield call(categoriesApi.fetchAllCategory)
    yield put(getAllCategorySuccess(res.data))
  } catch (error) {
    yield put(getAllCategoryFailure(error))
  }
}

function* categorySaga() {
  yield takeLatest(GET_ALL_CATEGORIES_REQUEST, getAllCategory)
}

export default categorySaga

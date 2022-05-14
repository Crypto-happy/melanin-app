import { call, put, takeLatest} from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { marketPlaceApi } from '../../../api'
import { get } from 'lodash'

function* search_products_by_text(action: any) {
  try {
    const { query, type } = action.payload

    const res = yield call(marketPlaceApi.getSearchProductsByText, query, type)
    yield put(Actions.search_products_success(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.search_products_failure(errMessage))
  }
}

function* allproductsSaga() {
  yield takeLatest(ActionTypes.SEARCH_PRODUCTS, search_products_by_text)
}

export default allproductsSaga

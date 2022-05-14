import { call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import { getLoyaltyTokensFailure, getLoyaltyTokensSuccess } from './actions'
import { earningsApi } from 'api'
import { convertArrayToObject } from 'utils'

function* getLoyaltyTokens() {
  try {
    const res = yield call(earningsApi.getLoyaltyTokens)

    const loyaltyTokens = convertArrayToObject(
      res.data.loyaltyTokens,
      'tokenType',
    )
    const formattedData = {
      total: res.data.total,
      loyaltyTokens: loyaltyTokens,
    }

    yield put(getLoyaltyTokensSuccess(formattedData))
  } catch (error) {
    yield put(getLoyaltyTokensFailure(error))
  }
}

function* earningsSaga() {
  yield takeLatest(ActionTypes.GET_LOYALTY_TOKENS_REQUEST, getLoyaltyTokens)
}

export default earningsSaga

import { get } from 'lodash'
import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  total: 0,
  loyaltyTokens: {},
  loading: false,
  error: null,
}

const handleGetLoyaltyTokensRequest = (state: any, action: any) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
  })
}

const handleGetLoyaltyTokensSuccess = (state: any, action: any) => {
  const { total, loyaltyTokens } = get(action, 'payload.result', {})

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    total: { $set: total },
    loyaltyTokens: { $merge: loyaltyTokens },
  })
}

const handleGetLoyaltyTokensFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const loyaltyTokensReducer = createReducer(initialState, {
  [ActionTypes.GET_LOYALTY_TOKENS_REQUEST]: handleGetLoyaltyTokensRequest,
  [ActionTypes.GET_LOYALTY_TOKENS_SUCCESS]: handleGetLoyaltyTokensSuccess,
  [ActionTypes.GET_LOYALTY_TOKENS_FAILURE]: handleGetLoyaltyTokensFailure,
})

export default loyaltyTokensReducer

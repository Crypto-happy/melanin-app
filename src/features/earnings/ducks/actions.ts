import * as ActionTypes from './action-types'

export const getLoyaltyTokensRequest = () => ({
  type: ActionTypes.GET_LOYALTY_TOKENS_REQUEST,
  showLoading: true,
})

export const getLoyaltyTokensSuccess = (result: any) => {
  return {
    type: ActionTypes.GET_LOYALTY_TOKENS_SUCCESS,
    payload: { result },
    showLoading: false,
  }
}

export const getLoyaltyTokensFailure = (error: any) => ({
  type: ActionTypes.GET_LOYALTY_TOKENS_FAILURE,
  payload: { error },
  showLoading: false,
})

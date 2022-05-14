import * as ActionTypes from './action-types'

export const sendReferralEmails = (result: any) => ({
  type: ActionTypes.SEND_REFERRAL_EMAILS,
  payload: {
    result,
  },
  showLoading: false,
})

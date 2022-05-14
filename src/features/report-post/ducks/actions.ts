import * as ActionTypes from './action-types'

export const reportPostRequest = (id: string, reason: number) => ({
  type: ActionTypes.REPORT_POST_REQUEST,
  payload: { id, reason },
  showLoading: true,
})

export const reportPostSuccess = (result: any) => ({
  type: ActionTypes.REPORT_POST_SUCCESS,
  payload: { result },
  showLoading: false,
})

export const reportPostFailure = (error: any) => ({
  type: ActionTypes.REPORT_POST_FAILURE,
  payload: { error },
  showLoading: false,
})

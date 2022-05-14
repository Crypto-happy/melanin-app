import * as ActionTypes from './action-types'

export const getNotificationsRequest = () => ({
  type: ActionTypes.GET_NOTIFICATIONS_REQUEST,
  showLoading: true,
})

export const getNotificationsSuccess = (result: any) => ({
  type: ActionTypes.GET_NOTIFICATIONS_SUCCESS,
  payload: {
    result,
  },
  showLoading: false
})

export const getNotificationsFailure = (error: any) => ({
  type: ActionTypes.GET_NOTIFICATIONS_FAILURE,
  payload: {
    error,
  },
  showLoading: false,
})

export const makeNotificationsSeenRequest = () => ({
  type: ActionTypes.SEEN_NOTIFICATIONS_REQUEST,
})

export const makeNotificationsSeenSuccess = (result: any) => ({
  type: ActionTypes.SEEN_NOTIFICATIONS_SUCCESS,
  payload: {
    result,
  },
  payload: {
    result,
  }
})

export const makeNotificationsSeenFailure = (error: any) => ({
  type: ActionTypes.SEEN_NOTIFICATIONS_FAILURE,
  payload: {
    error,
  }
})

import * as ActionTypes from './action-types'

export const getTopicsRequest = () => ({
  type: ActionTypes.GET_TOPICS_REQUEST,
})

export const getTopicsSuccess = (result: any) => ({
  type: ActionTypes.GET_TOPICS_SUCCESS,
  payload: {
    result,
  },
})

export const getTopicsFailure = (error: any) => ({
  type: ActionTypes.GET_TOPICS_FAILURE,
  payload: {
    error,
  },
})

export const followTopicsRequest = (topics: string[]) => ({
  type: ActionTypes.FOLLOW_TOPICS_REQUEST,
  payload: {
    topics,
  },
})

export const followTopicsSuccess = (result: any) => ({
  type: ActionTypes.FOLLOW_TOPICS_SUCCESS,
  payload: {
    result,
  },
})

export const followTopicsFailure = (error: any) => ({
  type: ActionTypes.FOLLOW_TOPICS_FAILURE,
  payload: {
    error,
  },
})

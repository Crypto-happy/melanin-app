import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const initialState = {
  reviewIds: [],
  pagination: {
    skip: 0,
    endReached: false,
  },
  loading: false,
  error: null,
}

const handleFetchReviews = (state: any, action: any) => {
  const { skip } = action.payload

  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleFetchReviewsSuccess = (state: any, action: any) => {
  const ids = action.payload.result.map((review: any) => review.id)

  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    reviewIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}

const handleAddReviewSuccess = (state: any, action: any) => {
  const review = action.payload.result
  const newReviewIds = [review.id, ...state.reviewIds]

  return update(state, {
    reviewIds: { $set: newReviewIds },
  })
}

const reviewsReducer = createReducer(initialState, {
  [ActionTypes.GET_REVIEWS_REQUEST]: handleFetchReviews,
  [ActionTypes.GET_REVIEWS_SUCCESS]: handleFetchReviewsSuccess,
  [ActionTypes.ADD_NEW_REVIEW_SUCCESS]: handleAddReviewSuccess,
})

export default reviewsReducer

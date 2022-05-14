import { createSelector } from 'reselect'
import { getReviewEntities, getUserEntities } from 'selectors/entities'

const getReviewIds = (state) => state.userReviews.reviewIds

export const reviewsSelector = createSelector(
  [getReviewIds, getReviewEntities, getUserEntities],
  (reviewIds, reviews, users) => {
    return reviewIds.map((reviewId: string) => {
      const review = reviews[reviewId]

      return {
        ...review,
        author: users[review.author],
      }
    })
  },
)

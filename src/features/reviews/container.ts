import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Reviews from './Reviews'
import * as Actions from './ducks/actions'
import { reviewsSelector } from './ducks/selectors'
// import {  } from './ducks/selectors'

const mapStateToProps = (state: any) => ({
  reviews: reviewsSelector(state),
  loading: state.userReviews.loading,
  pagination: state.userReviews.pagination,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getReviews: (targetId: string, skip: number, limit: number) =>
    dispatch(Actions.getReviewsRequest(targetId, skip, limit)),
  addReview: (targetId: string, content: string, rating: number) =>
    dispatch(Actions.addNewReviewRequest(targetId, content, rating)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Reviews)

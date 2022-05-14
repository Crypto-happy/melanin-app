import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import Insights from './Insights'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'
import { topPostsSelector } from './ducks/selectors'

import {
  getCustomerReviewRequest,
  getProfileStatsRequest,
  getTopPostsRequest,
  getPageInteractionRequest
} from './ducks/actions'

const mapStateToProps = (state: any) => ({
  posts: state.insights.postIds,
  customerReview: state.insights.customerReview,
  profileStats: state.insights.profileStats,
  interactionsGraph: state.insights.interactionsGraph,

})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getCustomerReview: () =>
    dispatch(getCustomerReviewRequest()),
  getProfileStats: (dropdownType:string) =>
    dispatch(getProfileStatsRequest(dropdownType)),
  getTopPosts: (skip: number, limit: number, type:string) =>
    dispatch(getTopPostsRequest(skip,limit, type)),
  getPageInteraction: (dropdownType:string) =>
    dispatch(getPageInteractionRequest(dropdownType)),
})

const headerOptions = {
  title: localizedStrings.insights.title,
  showLogo: false,
  showBackButton: true,
}

export default connect(mapStateToProps, mapDispatchToProps)(Insights)


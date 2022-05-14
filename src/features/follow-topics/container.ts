import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import FollowTopics from './FollowTopics'
import { followTopicsRequest, getTopicsRequest } from './ducks/actions'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'

const mapStateToProps = (state: any) => ({
  topics: state.followTopics.topics,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getTopics: () => dispatch(getTopicsRequest()),
  followTopics: (topics: string[]) => dispatch(followTopicsRequest(topics)),
})

const headerOptions = {
  title: localizedStrings.followTopics.title,
  showLogo: false,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCustomHeader(headerOptions),
)(FollowTopics)

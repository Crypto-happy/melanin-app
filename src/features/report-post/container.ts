import { connect } from 'react-redux'
import ReportPost from './ReportPost'
import { compose, Dispatch } from 'redux'
import { reportPostRequest } from './ducks/actions'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'

const mapStateToProps = (state: any) => {
  const { loading, success, error } = state.reportPost
  return { loading, success, error }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reportPost: (id: string, reason: number) =>
    dispatch(reportPostRequest(id, reason)),
})

const headerOptions = {
  title: localizedStrings.home.title,
  showLogo: false,
  showBackButton: true,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCustomHeader(headerOptions),
)(ReportPost)

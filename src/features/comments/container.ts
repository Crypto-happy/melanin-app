import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import Comments from './Comments'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'
import { getUserSettingRequest, updateUserSettingRequest } from '../settings/ducks/actions'

const mapStateToProps = (state: any) => ({
  settingData: state.settings.settingData,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserSettings: () => dispatch(getUserSettingRequest()),
  updateUserSetting: (settingObj:object) => dispatch(updateUserSettingRequest(settingObj)),
})

const headerOptions = {
  title: localizedStrings.comments.title,
  showLogo: false,
  showBackButton: true,
}

export default compose(
  withCustomHeader(headerOptions),
  connect(mapStateToProps, mapDispatchToProps),
)(Comments)

import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import Settings from './Settings'
import {
  logoutRequest,
  getUserSettingRequest,
  updateUserSettingRequest,
} from './ducks/actions'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'

const mapStateToProps = (state: any) => ({
  settingData: state.settings.settingData,
  siteUrls: state.settings.siteUrls,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch(logoutRequest()),
  getUserSettings: () => dispatch(getUserSettingRequest()),
  updateUserSetting: (settingObj: object) =>
    dispatch(updateUserSettingRequest(settingObj)),
})

const headerOptions = {
  title: localizedStrings.settings.title,
  showLogo: false,
  showBackButton: true,
}

export default compose(
  withCustomHeader(headerOptions),
  connect(mapStateToProps, mapDispatchToProps),
)(Settings)

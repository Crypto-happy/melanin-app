import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import PersonalInformation from './PersonalInformation'
import { getUserSettingRequest, updateUserSettingRequest } from '../settings/ducks/actions'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'

const mapStateToProps = (state: any) => ({
  settingData: state.settings.settingData,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserSettings: () => dispatch(getUserSettingRequest()),
  updateUserSetting: (settingObj:object) => dispatch(updateUserSettingRequest(settingObj)),
})

const headerOptions = {
  title: localizedStrings.personalInformation.title,
  showLogo: false,
  showBackButton: true,
}

export default compose(
  withCustomHeader(headerOptions),
  connect(mapStateToProps, mapDispatchToProps),
)(PersonalInformation)

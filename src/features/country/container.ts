import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import Country from './Country'
import localizedStrings from '../../localization'
import { getUserSettingRequest, updateUserSettingRequest } from '../settings/ducks/actions'
import withCustomHeader from '../../components/HOCs/withCustomHeader'

const mapStateToProps = (state: any) => ({
    settingData: state.settings.settingData,
})
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
    getUserSettings: () => dispatch(getUserSettingRequest()),
    updateUserSetting: (settingObj:object) => dispatch(updateUserSettingRequest(settingObj)),
})

const headerOptions = {
    title: localizedStrings.country.title,
    showLogo: false,
    showBackButton: true,
}
  
export default compose(
    withCustomHeader(headerOptions),
    connect(mapStateToProps, mapDispatchToProps),
)(Country)

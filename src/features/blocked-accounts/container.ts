import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import { getUserSettingRequest, updateUserSettingRequest, getBlockedUserRequest } from '../settings/ducks/actions'
import { blockUserRequest } from '../home/ducks/actions'
import withCustomHeader from '../../components/HOCs/withCustomHeader'
import localizedStrings from '../../localization'
import BlockedAccounts from './BlockedAccounts'

const mapStateToProps = (state: any) => ({
    settingData: state.settings.settingData,
    blockedUserList: state.settings.blockedUser,
})
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
    getUserSettings: () => dispatch(getUserSettingRequest()),
    getBlockedUser: () => dispatch(getBlockedUserRequest()),
    updateUserSetting: (settingObj:object) => dispatch(updateUserSettingRequest(settingObj)),
    blockUser: (id: string) => dispatch(blockUserRequest(id)),
})

const headerOptions = {
    title: localizedStrings.blockedAccount.title,
    showLogo: false,
    showBackButton: true,
}
  
export default compose(
    withCustomHeader(headerOptions),
    connect(mapStateToProps, mapDispatchToProps),
)(BlockedAccounts)


import { connect } from 'react-redux'
import { compose, Dispatch } from 'redux'
import ChangePassword from './ChangePassword'
import { changePasswordRequest } from './ducks/actions'
import localizedStrings from '../../localization'
import withCustomHeader from '../../components/HOCs/withCustomHeader'



const mapStateToProps = (state:any) => {
  const { requesting, success, error } = state.changePassword
  return {
    requesting,
    success,
    error,
  }
}

const mapDispatchToProps = (dispatch:any) => ({
  changePassword: (newPassword: string, oldPassword: string) =>
    dispatch(changePasswordRequest(newPassword, oldPassword)),
})

const headerOptions = {
  title: localizedStrings.changePassword.title,
  showLogo: false,
  showBackButton: true,
}

export default 
compose(
  withCustomHeader(headerOptions),
  connect(mapStateToProps, mapDispatchToProps)
)(ChangePassword)

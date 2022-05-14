import { connect } from 'react-redux'
import ResetPassword from './ResetPassword'
import { resetAll, resetPasswordRequest } from './ducks/actions'

const mapStateToProps = (state: any) => {
  const { requesting, success, error } = state.resetPassword
  return {
    requesting,
    success,
    error,
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  resetPassword: (password: string, accessToken: string) =>
    dispatch(resetPasswordRequest(password, accessToken)),
  resetAll: () => dispatch(resetAll()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

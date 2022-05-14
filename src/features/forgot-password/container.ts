import { connect } from 'react-redux'
import ForgotPassword from './ForgotPassword'
import { forgotPasswordRequest } from './ducks/actions'
import { Dispatch } from 'redux'

const mapStateToProps = (state: any) => {
  const { requesting, success, error } = state.forgotPassword
  return {
    requesting,
    success,
    error,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  forgotPassword: (email: string) => dispatch(forgotPasswordRequest(email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)

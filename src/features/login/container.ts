import { connect } from 'react-redux'
import Login from './Login'
import {
  loginAppleIdRequest,
  loginFacebookRequest,
  loginRequest,
} from './ducks/actions'
import { Dispatch } from 'redux'

const mapStateToProps = (state: any) => {
  const { requesting, success, error, fbUser, appleUser } = state.login
  return {
    requesting,
    success,
    error,
    fbUser,
    appleUser,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (email: string, password: string) =>
    dispatch(loginRequest(email, password)),
  loginFacebook: (userId: string, accessToken: string) =>
    dispatch(loginFacebookRequest(userId, accessToken)),
  loginAppleId: (appleAuth: any) => dispatch(loginAppleIdRequest(appleAuth)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)

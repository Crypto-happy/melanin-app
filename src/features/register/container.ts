import { connect } from 'react-redux'
import Register from './Register'
import { Dispatch } from 'redux'
import { getSiteUrlsRequest, registerAccountRequest } from './ducks/actions'
import {
  loginAppleIdRequest,
  loginFacebookRequest,
} from '../login/ducks/actions'

const mapStateToProps = (state: any) => {
  const { requesting, success, error, siteUrls } = state.register
  const { fbUser, appleUser } = state.login

  return {
    requesting,
    success,
    error,
    fbUser,
    appleUser,
    siteUrls
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  registerAccount: (data: any) => dispatch(registerAccountRequest(data)),
  loginFacebook: (userId: string, accessToken: string) =>
    dispatch(loginFacebookRequest(userId, accessToken)),
  loginAppleId: (appleAuth: any) => dispatch(loginAppleIdRequest(appleAuth)),
  getSiteUrls: () => dispatch(getSiteUrlsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)

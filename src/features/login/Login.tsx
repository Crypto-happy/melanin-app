import React from 'react'
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native'
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import { isEmpty } from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'

import COLORS from '../../constants/colors'
import localizedStrings from '../../localization'
import { DefaultButton } from '../../components/DefaultButton'
import DefaultInput from '../../components/DefaultInput'
import { IconType } from '../../components/Icon/Icon'
import LoginWithFacebookButton from '../../components/LoginWithFacebookButton'
import { NAVIGATORS } from '../../constants/navigators'
import { getScreenOptions } from '../../utils/navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ErrorsList from '../../components/ErrorsList'
import { FONT_FAMILIES } from '../../constants/fonts'

interface Props {
  navigation: any
  login: (email: string, password: string) => void
  requesting: boolean
  success: boolean
  error: string
  loginFacebook: (userId: string, accessToken: string) => void
  loginAppleId: (appleAuth: any) => void
  fbUser: any
  appleUser: any
}

interface State {
  email: string
  password: string
  emailError: boolean
  passwordError: boolean
  generalErrors: string[]
}

class Login extends React.Component<Props, State> {
  private fbUserId: string | null
  private fbAccessToken: string | null
  private appleUserId: string | null

  constructor(props: Props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      emailError: false,
      passwordError: false,
      generalErrors: [],
    }

    this.fbUserId = null
    this.fbAccessToken = null
    this.appleUserId = null
  }

  componentDidMount() {
    const options = {
      showLogo: false,
      showBackButton: true,
      onBackButtonPress: this.props.navigation.goBack,
      title: localizedStrings.login.title,
    }
    this.props.navigation.setOptions(getScreenOptions(options))
  }

  componentDidUpdate(prevProps: Props) {
    const { requesting } = prevProps

    const {
      requesting: currentRequesting,
      success: currentSuccess,
      error: currentError,
      fbUser,
      appleUser,
    } = this.props

    if (requesting !== currentRequesting && currentSuccess) {
      if (!isEmpty(fbUser)) {
        this.onLoginWithFacebookSuccess()
      } else if (!isEmpty(appleUser)) {
        this.onLoginWithAppleIdSuccess()
      } else {
        this.onLoginSuccess()
      }
    }

    if (requesting !== currentRequesting && currentError) {
      this.setState({
        generalErrors: [currentError],
      })
    }
  }

  onLoginSuccess = () => {}

  onLoginWithFacebookSuccess = () => {
    const { name, email } = this.props.fbUser
    this.props.navigation.navigate(NAVIGATORS.REGISTER.name, {
      fbUserId: this.fbUserId,
      name,
      email,
    })
  }

  onLoginWithAppleIdSuccess = () => {
    const { name, email } = this.props.appleUser
    this.props.navigation.navigate(NAVIGATORS.REGISTER.name, {
      appleUserId: this.appleUserId,
      name,
      email,
    })
  }

  onEmailTextChange = (text: string) => {
    this.setState({
      email: text,
      emailError: false,
    })
  }

  onPasswordTextChange = (text: string) => {
    this.setState({
      password: text,
      passwordError: false,
    })
  }

  validateAll = () => {
    const { email, password } = this.state
    const emailError = isEmpty(email)
    const passwordError = isEmpty(password) || password.length < 6

    this.setState({
      emailError,
      passwordError,
      generalErrors: [],
    })

    return !emailError && !passwordError
  }

  onForgotPasswordButtonPress = () => {
    this.props.navigation.navigate(NAVIGATORS.FORGOT_PASSWORD.name)
  }

  onSignUpPasswordButtonPress = () => {
    this.props.navigation.navigate(NAVIGATORS.REGISTER.name)
  }

  onLoginButtonPress = () => {
    const { email, password } = this.state
    if (this.validateAll()) {
      this.props.login(email, password)
    }
  }

  onLoginWithFacebookButtonPress = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then((data) => {
            if (data) {
              const { accessToken, userID } = data
              this.fbUserId = userID
              this.fbAccessToken = accessToken
              this.props.loginFacebook(userID, accessToken)
            }
          })
        }
      },
      (error: any) => {},
    )
  }

  handleSignIn = async (data: any) => {
    /* Redux actions, persisting data with AsyncStorage, redirection...*/
  }

  onAppleButtonPress = async () => {
    try {
      // make sign in request and return a response object containing authentication data
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      )

      // retrieve identityToken from sign in request
      const { identityToken } = appleAuthRequestResponse

      // user is authenticated
      if (
        credentialState === appleAuth.State.AUTHORIZED &&
        !isEmpty(identityToken)
      ) {
        this.appleUserId = appleAuthRequestResponse.user
        // send data to server for verification and sign in

        this.props.loginAppleId(appleAuthRequestResponse)
      } else {
        // no token, failed sign in
      }
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        // eslint-disable-next-line no-console
        console.log(' > Apple Auth Cancel')
      } else {
        // other unknown error
        // eslint-disable-next-line no-console
        console.log(' > Unknown error', error)
      }
    }
  }

  render() {
    const { email, password, emailError, passwordError, generalErrors } =
      this.state

    let showSignInByAppleId = Platform.select({
      ios: true,
      android: false,
    })
    const majorVersionIOS = parseInt(`${Platform.Version}`, 10)
    if (showSignInByAppleId && majorVersionIOS < 13) {
      showSignInByAppleId = false
    }

    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.content}>
          <View style={styles.topContent}>
            <View style={styles.headerSection}>
              <Image
                source={require('../../assets/images/login_background_sept_2021.png')}
                style={styles.logo}
              />

              <Text style={styles.headerTitle}>Let’s Login</Text>

              <Text style={styles.headerDescription}>
                Welcome, if you already have a account login here.
              </Text>
            </View>

            <DefaultInput
              containerStyle={styles.emailInputContainer}
              placeholder={localizedStrings.login.emailInput.placeholder}
              iconStartType={IconType.MaterialIcons}
              iconStartName={'email'}
              autoFocus={true}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              value={email}
              hasError={emailError}
              onChangeText={this.onEmailTextChange}
            />

            <DefaultInput
              containerStyle={styles.passwordInputContainer}
              placeholder={localizedStrings.login.passwordInput.placeholder}
              iconStartType={IconType.MaterialIcons}
              iconStartName={'lock'}
              secureTextEntry={true}
              value={password}
              hasError={passwordError}
              onChangeText={this.onPasswordTextChange}
              onSubmitEditing={this.onLoginButtonPress}
            />

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={this.onForgotPasswordButtonPress}>
              <Text style={styles.forgotPasswordText}>
                {localizedStrings.login.forgotPasswordButton}
              </Text>
            </TouchableOpacity>

            <ErrorsList errors={generalErrors} style={styles.errorsList} />
          </View>

          <View style={styles.bottomContent}>
            <DefaultButton
              style={styles.loginButton}
              text={localizedStrings.login.loginButton}
              onPress={this.onLoginButtonPress}
            />

            {/*<LoginWithFacebookButton*/}
            {/*  style={styles.loginWithFacebookButton}*/}
            {/*  text={localizedStrings.login.loginWithFacebookButton}*/}
            {/*  onPress={this.onLoginWithFacebookButtonPress}*/}
            {/*/>*/}

            {showSignInByAppleId && (
              <View style={styles.appleButtonWrapper}>
                <AppleButton
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={styles.appleButton}
                  textStyle={styles.appleButtonText}
                  onPress={() => this.onAppleButtonPress()}
                />
              </View>
            )}

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                {localizedStrings.login.signUpNote}
              </Text>
              <TouchableOpacity
                style={styles.signUpButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={this.onSignUpPasswordButtonPress}>
                <Text style={[styles.signUpText, styles.signUpButtonText]}>
                  {localizedStrings.login.signUpButton}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.white,
  },
  container: {
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 37,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 22,
    height: '100%',
  },

  topContent: {
    alignItems: 'stretch',
    marginBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    color: COLORS.black,
    width: '100%',
  },
  headerDescription: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.black,
    width: '100%',
    marginVertical: 10,
  },
  logo: {
    width: '100%',
    height: 260,
    marginTop: -60,
    marginBottom: 10,
  },
  emailInputContainer: {
    marginBottom: 20,
  },
  passwordInputContainer: {
    marginBottom: 22,
  },
  forgotPasswordButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: COLORS.midGray,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    fontSize: 14,
    width: '100%',
    textAlign: 'right',
  },
  bottomContent: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  loginButton: {
    marginBottom: 22,
  },
  loginWithFacebookButton: {
    marginBottom: 22,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: COLORS.silver,
  },
  signUpButton: {
    marginLeft: 10,
  },
  signUpButtonText: {
    textDecorationLine: 'underline',
  },
  errorsList: {
    marginTop: 22,
  },
  appleButtonWrapper: {
    height: 47,
    marginBottom: 22,
    borderRadius: 5,
  },
  appleButton: {
    flex: 1,
    textTransform: 'capitalize',
  },
  appleButtonText: {
    textTransform: 'uppercase',
  },
})

export default Login

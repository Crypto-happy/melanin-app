import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import DefaultInput from '../../components/DefaultInput'
import localizedStrings from '../../localization'
import { IconType } from '../../components/Icon/Icon'
import { DefaultButton } from '../../components/DefaultButton'
import LoginWithFacebookButton from '../../components/LoginWithFacebookButton'
import COLORS from '../../constants/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getScreenOptions } from '../../utils/navigation'
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import { ACCOUNT_TYPE } from '../../types'
import { get, isEmpty } from 'lodash'
import ErrorsList from '../../components/ErrorsList'
import { AccessToken, LoginManager } from 'react-native-fbsdk'
import ConfirmationModal from '../../components/ConfirmationModal'
import { openInbox } from 'react-native-email-link'
import Select from 'components/Select/Select'
import { NAVIGATORS } from 'constants/navigators'
import { openUrl } from 'utils'
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication'

interface Props {
  navigation: any
  registerAccount: (data: any) => void
  requesting: boolean
  success: boolean
  error: string
  route: any
  loginFacebook: (userId: string, accessToken: string) => void
  loginAppleId: (appleAuth: any) => void
  getSiteUrls: () => void
  fbUser: any
  appleUser: any
  siteUrls: any
}

interface State {
  email: string
  password: string
  name: string
  referralCode: string
  accountType: ACCOUNT_TYPE
  emailError: boolean
  passwordError: boolean
  nameError: boolean
  generalErrors: string[]
  showRegisterSuccessModal: boolean
  businessCategory: string
}

class Register extends React.Component<Props, State> {
  accountTypeRadioProps: any[]
  fbUserId: string | null
  appleUserId: string | null

  constructor(props: Props) {
    super(props)

    this.state = {
      email: get(props.route, 'params.email', ''),
      password: '',
      name: get(props.route, 'params.name', ''),
      referralCode: '',
      accountType: ACCOUNT_TYPE.PERSONAL,
      emailError: false,
      passwordError: false,
      nameError: false,
      generalErrors: [],
      showRegisterSuccessModal: false,
      businessCategory: '',
    }

    this.accountTypeRadioProps = [
      {
        label: localizedStrings.register.accountTypes.options.personal,
        value: ACCOUNT_TYPE.PERSONAL,
      },
      {
        label: localizedStrings.register.accountTypes.options.business,
        value: ACCOUNT_TYPE.BUSINESS,
      },
    ]
    this.fbUserId = get(props.route, 'params.fbUserId', null)
    this.appleUserId = get(props.route, 'params.appleUserId', null)
  }

  componentDidMount() {
    const options = {
      showLogo: false,
      showBackButton: true,
      onBackButtonPress: this.props.navigation.goBack,
      title: localizedStrings.register.title,
    }
    this.props.navigation.setOptions(getScreenOptions(options))
    this.props.getSiteUrls()
  }

  componentDidUpdate(prevProps: Props) {
    const { requesting, fbUser, appleUser } = prevProps
    const {
      requesting: currentRequesting,
      success: currentSuccess,
      error: currentError,
      fbUser: currentFbUser,
      appleUser: currentAppleUser,
    } = this.props

    if (requesting !== currentRequesting && currentSuccess) {
      this.onRegisterAccountSuccess()
    }

    if (requesting !== currentRequesting && currentError) {
      this.setState({
        generalErrors: [currentError],
      })
    }

    if (currentFbUser && currentFbUser !== fbUser) {
      const { name, email } = currentFbUser
      this.setState({
        name,
        email,
      })
    }

    if (!isEmpty(currentAppleUser) && isEmpty(appleUser)) {
      const { name, email } = currentAppleUser
      this.setState({
        name,
        email,
      })
    }
  }

  onRegisterAccountSuccess = () => {
    this.setState({
      showRegisterSuccessModal: true,
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

  onNameTextChange = (text: string) => {
    this.setState({
      name: text,
      nameError: false,
    })
  }
  onReferralCodeTextChange = (text: string) => {
    this.setState({
      referralCode: text,
    })
  }

  onAccountTypeChange = (value: ACCOUNT_TYPE) => {
    this.setState({
      accountType: value,
    })
  }

  validateAll = () => {
    const { email, password, name } = this.state
    const emailError = isEmpty(email)
    const passwordError = isEmpty(password) || password.length < 6
    const nameError = isEmpty(name)

    this.setState({
      emailError,
      passwordError,
      nameError,
      generalErrors: [],
    })

    return !emailError && !passwordError && !nameError
  }

  onSignUpButtonPress = () => {
    const { registerAccount } = this.props
    const {
      email,
      password,
      name,
      accountType,
      businessCategory,
      referralCode,
    } = this.state

    const data = {
      email,
      password,
      name,
      referralCode,
      accountType,
      businessCategory,
      appleUserId: this.appleUserId,
    }

    if (this.validateAll()) {
      registerAccount(data)
      this.setState({
        generalErrors: [],
      })
    }
  }

  onSignUpWithFacebookButtonPress = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then((data) => {
            if (data) {
              const { accessToken, userID } = data
              this.fbUserId = userID
              this.props.loginFacebook(userID, accessToken)
            }
          })
        }
      },
      (error: any) => {},
    )
  }

  onRegisterSuccessModalCancel = () => {
    this.setState({
      showRegisterSuccessModal: false,
    })
  }

  onRegisterSuccessModalOk = () => {
    this.setState(
      {
        showRegisterSuccessModal: false,
      },
      () => {
        openInbox({})
      },
    )
  }

  onSelectBusinessCategoriesPress = () => {
    this.props.navigation.navigate(NAVIGATORS.BUSINESS_CATEGORIES.name, {
      onSelect: this.onSelectBusinessCategory,
    })
  }

  onSelectBusinessCategory = (category: string) => {
    this.setState({
      businessCategory: category,
    })
  }

  onPrivacyLinkPress = () => {
    const privacyUrl = get(this.props, 'siteUrls.privacyUrl', '')

    if (!isEmpty(privacyUrl)) {
      openUrl(privacyUrl)
    }
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
    const {
      email,
      name,
      password,
      referralCode,
      accountType,
      emailError,
      passwordError,
      nameError,
      generalErrors,
      showRegisterSuccessModal,
      businessCategory,
    } = this.state

    let showSignInByAppleId = Platform.select({
      ios: true,
      android: false,
    })
    const majorVersionIOS = parseInt(`${Platform.Version}`, 10)
    if (showSignInByAppleId && majorVersionIOS < 13) {
      showSignInByAppleId = false
    }

    const shouldShowBusinessCategory = accountType === ACCOUNT_TYPE.BUSINESS

    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.content}>
          <View style={styles.topContent}>
            <DefaultInput
              containerStyle={styles.emailInputContainer}
              placeholder={localizedStrings.register.emailInput.placeholder}
              iconStartType={IconType.MaterialIcons}
              iconStartName={'email'}
              autoFocus={true}
              keyboardType={'email-address'}
              onChangeText={this.onEmailTextChange}
              autoCapitalize={'none'}
              hasError={emailError}
              value={email}
            />

            <DefaultInput
              containerStyle={styles.passwordInputContainer}
              placeholder={localizedStrings.register.passwordInput.placeholder}
              iconStartType={IconType.MaterialIcons}
              iconStartName={'lock'}
              onChangeText={this.onPasswordTextChange}
              autoCapitalize={'none'}
              secureTextEntry={true}
              hasError={passwordError}
              value={password}
            />

            <DefaultInput
              containerStyle={styles.passwordInputContainer}
              placeholder={localizedStrings.register.nameInput.placeholder}
              iconStartType={IconType.MaterialIcons}
              iconStartName={'person'}
              onChangeText={this.onNameTextChange}
              autoCapitalize={'words'}
              hasError={nameError}
              value={name}
            />

            <DefaultInput
              containerStyle={styles.passwordInputContainer}
              placeholder={
                localizedStrings.register.referralCodeInput.placeholder
              }
              iconStartType={IconType.MaterialIcons}
              iconStartName={'loyalty'}
              onChangeText={this.onReferralCodeTextChange}
              autoCapitalize={'words'}
              value={referralCode}
            />

            <Text style={styles.accountTypesText}>
              {localizedStrings.register.accountTypes.label}
            </Text>

            {this.accountTypeRadioProps.map((obj, i) => (
              <RadioButton key={i} wrapStyle={styles.radioButton}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={accountType === obj.value}
                  onPress={() => this.onAccountTypeChange(obj.value)}
                  borderWidth={1}
                  buttonInnerColor={COLORS.oceanGreen}
                  buttonOuterColor={COLORS.oceanGreen}
                  buttonSize={15}
                  buttonOuterSize={20}
                  buttonStyle={{}}
                  buttonWrapStyle={styles.radioButtonInput}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  onPress={() => this.onAccountTypeChange(obj.value)}
                  labelStyle={styles.radioButtonLabel}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            ))}
            {shouldShowBusinessCategory && (
              <Select
                style={styles.businessCategoryContainer}
                placeholder={
                  localizedStrings.register.businessCategory.placeholder
                }
                text={businessCategory}
                label={localizedStrings.register.businessCategory.label}
                onPress={this.onSelectBusinessCategoriesPress}
              />
            )}
            <ErrorsList errors={generalErrors} style={styles.errorsList} />
          </View>

          <TouchableOpacity onPress={this.onPrivacyLinkPress}>
            <Text style={styles.privacyText}>
              By signing up, you agree to our{' '}
              <Text style={styles.privacyLink}>
                Terms, Privacy Policy and End User Agreement
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomContent}>
            <DefaultButton
              style={styles.signUpButton}
              text={localizedStrings.register.signUpButton}
              onPress={this.onSignUpButtonPress}
            />

            {/*{!this.fbUserId && isEmpty(this.appleUserId) && (*/}
            {/*  <LoginWithFacebookButton*/}
            {/*    style={styles.signUpWithFacebookButton}*/}
            {/*    text={localizedStrings.register.signUpWithFacebookButton}*/}
            {/*    onPress={this.onSignUpWithFacebookButtonPress}*/}
            {/*  />*/}
            {/*)}*/}

            {showSignInByAppleId &&
              !this.appleUserId &&
              isEmpty(this.fbUserId) && (
                <View style={styles.appleButtonWrapper}>
                  <AppleButton
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGN_UP}
                    style={styles.appleButton}
                    textStyle={styles.appleButtonText}
                    onPress={() => this.onAppleButtonPress()}
                  />
                </View>
              )}
          </View>
          <ConfirmationModal
            visible={showRegisterSuccessModal}
            title={localizedStrings.register.successModal.title}
            message={localizedStrings.register.successModal.message}
            okButtonText={localizedStrings.register.successModal.okButtonText}
            onCancelButtonPress={this.onRegisterSuccessModalCancel}
            onOkButtonPress={this.onRegisterSuccessModalOk}
          />
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
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 37,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 22,
  },

  topContent: {
    alignItems: 'stretch',
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
    color: COLORS.silver,
    fontSize: 14,
  },
  bottomContent: {
    alignItems: 'stretch',
    marginBottom: 28,
  },
  signUpButton: {
    marginBottom: 22,
  },
  signUpWithFacebookButton: {},
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: COLORS.silver,
  },
  signUpButtonText: {
    textDecorationLine: 'underline',
  },
  radioButton: {
    marginBottom: 10,
  },
  radioButtonInput: {
    marginRight: 10,
  },
  radioButtonLabel: {
    fontSize: 15,
    color: COLORS.black,
  },
  accountTypesText: {
    fontSize: 15,
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 10,
  },
  errorsList: {
    marginTop: 22,
  },
  businessCategoryContainer: {
    marginTop: 20,
  },
  privacyTextContainer: {
    flexDirection: 'row',
  },
  privacyText: {
    fontSize: 15,
    lineHeight: 25,
  },
  privacyLink: {
    fontSize: 15,
    color: COLORS.cornFlowerBlue,
  },
  appleButtonWrapper: {
    height: 47,
    marginTop: 22,
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

export default Register

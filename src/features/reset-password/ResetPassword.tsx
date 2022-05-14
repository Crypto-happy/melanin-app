import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import localizedStrings from '../../localization'
import DefaultInput from '../../components/DefaultInput'
import { IconType } from '../../components/Icon/Icon'
import { DefaultButton } from '../../components/DefaultButton'
import COLORS from '../../constants/colors'
import { getScreenOptions } from '../../utils/navigation'
import { isEmpty } from 'lodash'
import { NAVIGATORS } from '../../constants/navigators'
import InfoModal from 'components/InfoModal'
import { CommonActions } from '@react-navigation/native'

type Props = {
  navigation: any
  route: any
  resetPassword: (password: string, accessToken: string) => void
  requesting: boolean
  success: boolean
  error: string
  resetAll: () => void
}

interface State {
  password: string
  confirmPassword: string
  passwordError: boolean
  confirmPasswordError: boolean
  generalErrors: string[]
  showSuccessModal: boolean
}

class ResetPassword extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      password: '',
      confirmPassword: '',
      passwordError: false,
      confirmPasswordError: false,
      generalErrors: [],
      showSuccessModal: false,
    }
  }

  componentDidMount() {
    const options = {
      showLogo: false,
      showBackButton: true,
      onBackButtonPress: this.handleGoBack,
      title: localizedStrings.resetPassword.title,
    }
    this.props.navigation.setOptions(getScreenOptions(options))
    this.props.resetAll()
  }

  componentDidUpdate(prevProps: Props) {
    const { requesting } = prevProps
    const {
      requesting: currentRequesting,
      success: currentSuccess,
      error: currentError,
    } = this.props

    if (requesting !== currentRequesting && currentSuccess) {
      this.onResetPasswordSuccess()
    }

    if (requesting !== currentRequesting && currentError) {
      this.setState({
        generalErrors: [currentError],
      })
    }
  }

  onResetPasswordSuccess = () => {
    this.setState({
      showSuccessModal: true,
    })
  }

  handleGoBack = () => {
    const { navigation } = this.props

    const moveToWelcome = CommonActions.reset({
      index: 0,
      routes: [{ name: NAVIGATORS.WELCOME.name }],
    })

    navigation.dispatch(moveToWelcome)
  }

  onSuccessModalOkButtonPress = () => {
    const { navigation } = this.props

    const moveToLogin = CommonActions.reset({
      index: 0,
      routes: [
        { name: NAVIGATORS.WELCOME.name },
        { name: NAVIGATORS.AUTH.name },
      ],
    })

    navigation.dispatch(moveToLogin)
  }

  onPasswordTextChange = (text: string) => {
    this.setState({
      password: text,
      passwordError: false,
    })
  }

  onConfirmPasswordTextChange = (text: string) => {
    this.setState({
      confirmPassword: text,
      confirmPasswordError: false,
    })
  }

  validateAll = () => {
    const { password, confirmPassword } = this.state
    const passwordError = isEmpty(password) || password.length < 6
    const confirmPasswordError =
      isEmpty(password) ||
      confirmPassword.length < 6 ||
      confirmPassword !== password

    this.setState({
      passwordError,
      confirmPasswordError,
      generalErrors: [],
    })

    return !passwordError && !confirmPasswordError
  }

  onChangePasswordButtonPress = () => {
    const { route, resetPassword } = this.props
    const { password } = this.state
    if (this.validateAll()) {
      resetPassword(password, route.params.accessToken)
    }
  }

  render() {
    const {
      password,
      confirmPassword,
      passwordError,
      confirmPasswordError,
      showSuccessModal,
    } = this.state
    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={false}>
        <View style={styles.content}>
          <View style={styles.topContent}>
            <Text style={styles.instructionText}>
              {localizedStrings.resetPassword.instruction}
            </Text>
            <DefaultInput
              containerStyle={styles.newPasswordInputContainer}
              placeholder={
                localizedStrings.resetPassword.newPasswordInput.placeholder
              }
              iconStartType={IconType.MaterialIcons}
              iconStartName={'lock'}
              autoFocus={true}
              value={password}
              hasError={passwordError}
              onChangeText={this.onPasswordTextChange}
              secureTextEntry={true}
            />

            <DefaultInput
              containerStyle={styles.confirmNewPasswordInputContainer}
              placeholder={
                localizedStrings.resetPassword.confirmNewPasswordInput
                  .placeholder
              }
              iconStartType={IconType.MaterialIcons}
              iconStartName={'lock'}
              value={confirmPassword}
              hasError={confirmPasswordError}
              onChangeText={this.onConfirmPasswordTextChange}
              onSubmitEditing={this.onChangePasswordButtonPress}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.bottomContent}>
            <DefaultButton
              style={styles.changePasswordButton}
              text={localizedStrings.resetPassword.changePasswordButton}
              onPress={this.onChangePasswordButtonPress}
            />
          </View>
        </View>
        <InfoModal
          visible={showSuccessModal}
          message={localizedStrings.resetPassword.successMessage}
          onOkButtonPress={this.onSuccessModalOkButtonPress}
        />
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: COLORS.white,
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
  instructionText: {
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 22,
  },
  newPasswordInputContainer: {
    marginBottom: 20,
  },
  confirmNewPasswordInputContainer: {},
  bottomContent: {
    alignItems: 'stretch',
    marginBottom: 28,
  },
  changePasswordButton: {},
})

export default ResetPassword

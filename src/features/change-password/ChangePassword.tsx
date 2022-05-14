import React from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import localizedStrings from '../../localization'
import DefaultInput from '../../components/DefaultInput'
import { IconType } from '../../components/Icon/Icon'
import { DefaultButton } from '../../components/DefaultButton'
import COLORS from '../../constants/colors'
import { getScreenOptions } from '../../utils/navigation'
import { isEmpty } from 'lodash'
import { NAVIGATORS } from '../../constants/navigators'
import ErrorsList from '../../components/ErrorsList'

type Props = {
  navigation: any
  route: any
  changePassword: (newPassword: string, oldPassword: string) => void
  requesting: boolean
  success: boolean
  error: string
}

interface State {
  oldPassword: string
  password: string
  confirmPassword: string
  passwordError: boolean
  confirmPasswordError: boolean
  oldPasswordError: boolean
  generalErrors: string[]
}

class ChangePassword extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      oldPassword: '',
      oldPasswordError: false,
      password: '',
      passwordError: false,
      confirmPassword: '',
      confirmPasswordError: false,
      generalErrors: [],
    }
  }

  componentDidMount() {
    const options = {
      showLogo: false,
      showBackButton: true,
      onBackButtonPress: this.props.navigation.goBack,
      title: localizedStrings.changePassword.title,
    }
    this.props.navigation.setOptions(getScreenOptions(options))
  }

  componentDidUpdate(prevProps: Props) {
    const { requesting } = prevProps
    const {
      requesting: currentRequesting,
      success: currentSuccess,
      error: currentError,
    } = this.props

    if (requesting !== currentRequesting && currentSuccess) {
      this.onChangePasswordSuccess()
    }

    if (requesting !== currentRequesting && currentError) {
      this.setState({
        generalErrors: [currentError],
      })
    }
  }

  onChangePasswordSuccess = () => {
    Alert.alert('Success', 'Change password successfully')
    this.props.navigation.goBack()
  }

  onPasswordTextChange = (text: string) => {
    this.setState({
      password: text,
      passwordError: false,
      generalErrors: [],
    })
  }

  onOldPasswordTextChange = (text: string) => {
    this.setState({
      oldPassword: text,
      oldPasswordError: false,
      generalErrors: [],
    })
  }

  onConfirmPasswordTextChange = (text: string) => {
    this.setState({
      confirmPassword: text,
      confirmPasswordError: false,
      generalErrors: [],
    })
  }

  validateAll = () => {
    const { password, confirmPassword, oldPassword } = this.state
    const passwordError = isEmpty(password) || password.length < 6
    const oldPasswordError = isEmpty(oldPassword) || oldPassword.length < 6
    const confirmPasswordError =
      isEmpty(password) ||
      confirmPassword.length < 6 ||
      confirmPassword !== password

    this.setState({
      passwordError,
      oldPasswordError,
      confirmPasswordError,
      generalErrors: [],
    })

    return !passwordError && !confirmPasswordError
  }

  onChangePasswordButtonPress = () => {
    const { changePassword } = this.props
    const { password, oldPassword } = this.state
    if (this.validateAll()) {
      changePassword(password, oldPassword)
    }
  }

  render() {
    const {
      password,
      generalErrors,
      oldPassword,
      oldPasswordError,
      confirmPassword,
      passwordError,
      confirmPasswordError,
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
              {localizedStrings.changePassword.instruction}
            </Text>
            <DefaultInput
              containerStyle={styles.newPasswordInputContainer}
              placeholder={
                localizedStrings.changePassword.oldPasswordInput.placeholder
              }
              iconStartType={IconType.MaterialIcons}
              iconStartName={'lock'}
              autoFocus={true}
              value={oldPassword}
              hasError={oldPasswordError}
              onChangeText={this.onOldPasswordTextChange}
              secureTextEntry={true}
            />

            <DefaultInput
              containerStyle={styles.newPasswordInputContainer}
              placeholder={
                localizedStrings.changePassword.newPasswordInput.placeholder
              }
              iconStartType={IconType.MaterialIcons}
              iconStartName={'lock'}
              value={password}
              hasError={passwordError}
              onChangeText={this.onPasswordTextChange}
              secureTextEntry={true}
            />

            <DefaultInput
              containerStyle={styles.confirmNewPasswordInputContainer}
              placeholder={
                localizedStrings.changePassword.confirmNewPasswordInput
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
            <ErrorsList errors={generalErrors} style={styles.errorsList} />
          </View>

          <View style={styles.bottomContent}>
            <DefaultButton
              style={styles.changePasswordButton}
              text={localizedStrings.changePassword.changePasswordButton}
              onPress={this.onChangePasswordButtonPress}
            />
          </View>
        </View>
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
  errorsList: {
    marginTop: 22,
  },
})

export default ChangePassword

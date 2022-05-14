import React from 'react'
import { Linking, StyleSheet, Text, View } from 'react-native'
import COLORS from '../../constants/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import localizedStrings from '../../localization'
import { IconType } from '../../components/Icon/Icon'
import DefaultInput from '../../components/DefaultInput'
import { DefaultButton } from '../../components/DefaultButton'
import { getScreenOptions } from '../../utils/navigation'
import ErrorsList from '../../components/ErrorsList'
import { isEmpty } from 'lodash'
import InfoModal from 'components/InfoModal'

interface Props {
  navigation: any
  forgotPassword: (email: string) => void
  requesting: boolean
  success: boolean
  error: string
}

interface State {
  email: string
  emailError: boolean
  generalErrors: string[]
  showSuccessModal: boolean
}

class ForgotPassword extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      email: '',
      emailError: false,
      generalErrors: [],
      showSuccessModal: false,
    }
  }

  componentDidMount() {
    const options = {
      showLogo: false,
      showBackButton: true,
      onBackButtonPress: this.props.navigation.goBack,
      title: localizedStrings.forgotPassword.title,
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
      this.setState({
        showSuccessModal: true,
      })
    }

    if (requesting !== currentRequesting && currentError) {
      this.setState({
        generalErrors: [currentError],
      })
    }
  }

  onSuccessModalOkButtonPress = () => {
    this.setState(
      {
        showSuccessModal: false,
      },
      () => {
        Linking.canOpenURL('message:0').then((supported) => {
          if (supported) {
            Linking.openURL('message:0')
          }
        })
      },
    )
  }

  onEmailTextChange = (text: string) => {
    this.setState({
      email: text,
      emailError: false,
    })
  }

  validateAll = () => {
    const { email } = this.state
    const emailError = isEmpty(email)

    this.setState({
      emailError,
      generalErrors: [],
    })

    return !emailError
  }

  onNextButtonPress = () => {
    if (this.validateAll()) {
      this.props.forgotPassword(this.state.email)
    }
  }

  render() {
    const { email, emailError, generalErrors, showSuccessModal } = this.state

    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={false}>
        <View style={styles.content}>
          <View style={styles.topContent}>
            <Text style={styles.instructionText}>
              {localizedStrings.forgotPassword.instruction}
            </Text>
            <DefaultInput
              containerStyle={styles.emailInputContainer}
              placeholder={
                localizedStrings.forgotPassword.emailInput.placeholder
              }
              iconStartType={IconType.MaterialIcons}
              iconStartName={'email'}
              autoFocus={true}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              value={email}
              hasError={emailError}
              onChangeText={this.onEmailTextChange}
            />

            <ErrorsList errors={generalErrors} style={styles.errorsList} />
          </View>

          <View style={styles.bottomContent}>
            <DefaultButton
              style={styles.nextButton}
              text={localizedStrings.forgotPassword.nextButton}
              onPress={this.onNextButtonPress}
            />
          </View>
          <InfoModal
            visible={showSuccessModal}
            message={localizedStrings.forgotPassword.successMessage}
            onOkButtonPress={this.onSuccessModalOkButtonPress}
          />
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
  emailInputContainer: {},
  bottomContent: {
    alignItems: 'stretch',
    marginBottom: 28,
  },
  nextButton: {},
  errorsList: {
    marginTop: 22,
  },
})

export default ForgotPassword

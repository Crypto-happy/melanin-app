import React from 'react'
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import localizedStrings from '../../localization'
import { DefaultButton } from '../../components/DefaultButton'
import SignUpButton from './components/SignUpButton'
import COLORS from '../../constants/colors'
import { StackNavigationProp } from '@react-navigation/stack'
import { NAVIGATORS } from '../../constants/navigators'
import { FONT_FAMILIES } from 'constants/fonts'

type NavigationProp = StackNavigationProp<undefined, NAVIGATORS.WELCOME.name>

interface Props {
  navigation: NavigationProp
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

class Welcome extends React.Component<Props> {
  componentDidMount() {
    const style = Platform.OS === 'ios' ? 'dark-content' : 'light-content'
    StatusBar.setBarStyle(style)
  }

  onLoginButtonPress = () => {
    // this.props.navigation.navigate(NAVIGATORS.LOGIN.name)
    this.props.navigation.navigate(NAVIGATORS.AUTH.name, {
      screen: NAVIGATORS.LOGIN.name,
    })
  }

  onSignUpButtonPress = () => {
    // this.props.navigation.navigate(NAVIGATORS.REGISTER.name)
    this.props.navigation.navigate(NAVIGATORS.AUTH.name, {
      screen: NAVIGATORS.REGISTER.name,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={require('../../assets/images/welcome_background_sept_2021.jpeg')}>
          <SafeAreaView style={styles.safeContainer}>
            <View style={styles.backgroundOverlay} />
            <View style={styles.topContent}>
              <Image
                source={require('../../assets/images/logo_sept_2021.png')}
                style={styles.logo}
              />
            </View>
            <View style={styles.bottomContent}>
              <DefaultButton
                style={styles.loginButton}
                text={localizedStrings.welcome.login}
                onPress={this.onLoginButtonPress}
              />
              <SignUpButton
                style={styles.signUpButton}
                text={localizedStrings.welcome.signUp}
                onPress={this.onSignUpButtonPress}
              />
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    opacity: 0.23,
  },
  topContent: {
    alignItems: 'center',
    marginTop: '14%',
  },
  logo: {
    width: 150,
    height: 106,
  },
  welcomeText: {
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
  },
  bottomContent: {
    alignItems: 'stretch',
    marginBottom: 23,
    paddingHorizontal: 37,
  },
  loginButton: {
    marginBottom: 22,
  },
  signUpButton: {},
})

export default Welcome

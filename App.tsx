import React from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from 'store'
import messaging from '@react-native-firebase/messaging'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import { isEmpty, get } from 'lodash'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import NavigatorWrapper from './src/navigators/NavigatorWrapper'
import { dynamicLinkPrefix, florntScheme, webScheme } from 'constants/index'
import * as NavigationService from './src/navigators/NavigationService'
import { getNotificationsRequest } from './src/features/notifications/ducks/actions'
import { setDynamicLink } from './src/navigators/ducks/actions'
import { NAVIGATORS } from './src/constants/navigators'

// eslint-disable-next-line no-console
console.disableYellowBox = true

messaging().setBackgroundMessageHandler(async (remoteMessage) => {})

class App extends React.Component {
  unsubscribe?: Function

  async componentDidMount() {
    await this.requestUserPermission()

    messaging().onMessage(async (remoteMessage) => {
      store.dispatch(getNotificationsRequest())
    })

    messaging().onNotificationOpenedApp(this.handleMessageNotification)
    messaging().getInitialNotification().then(this.handleMessageNotification)
    dynamicLinks().getInitialLink().then(this.handleDynamicLink)

    this.unsubscribe = dynamicLinks().onLink(this.handleDynamicLink)
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission()
    if (authorizationStatus) {
    }
  }

  handleMessageNotification = (remoteMessage: any) => {
    if (isEmpty(remoteMessage)) {
      return
    }

    const dataScreen = get(remoteMessage, 'data.screen', '')
    const dataId = get(remoteMessage, 'data.id', '')

    switch (dataScreen) {
      case 'post':
        setTimeout(() => {
          NavigationService.navigate(NAVIGATORS.MAIN.name, {
            screen: NAVIGATORS.HOME.name,
            params: {
              screen: NAVIGATORS.HOME_STACK.name,
              params: {
                screen: NAVIGATORS.POST_DETAILS.name,
                params: { id: dataId },
              },
            },
          })
        }, 0)
        break

      case 'profile':
        setTimeout(() => {
          NavigationService.navigate(NAVIGATORS.MAIN.name, {
            screen: NAVIGATORS.HOME.name,
            params: {
              screen: NAVIGATORS.HOME_STACK.name,
              params: {
                screen: NAVIGATORS.USER_PROFILE.name,
                params: { userId: dataId },
              },
            },
          })
        }, 0)
        break

      default:
        break
    }
  }

  handleDynamicLink = (link: any) => {
    if (link === null) return

    const decodeUrl = decodeURI(link.url)
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      params: any = {},
      match

    while ((match = regex.exec(decodeUrl))) {
      params[match[1]] = match[2]
    }

    if (decodeUrl.includes('/post?')) {
      const { postId } = params
      store.dispatch(
        setDynamicLink({
          screen: NAVIGATORS.POST_DETAILS.name,
          params: { id: postId },
        }),
      )

      return
    }

    if (decodeUrl.includes('/profile?')) {
      const { userId } = params
      store.dispatch(
        setDynamicLink({
          screen: NAVIGATORS.USER_PROFILE.name,
          params: { userId },
        }),
      )

      return
    }
  }

  render() {
    const linking = {
      prefixes: [florntScheme, webScheme],
      config: {
        screens: {
          [NAVIGATORS.AUTH.name]: {
            path: NAVIGATORS.AUTH.name,
            screens: {
              [NAVIGATORS.LOGIN.name]: {
                path: NAVIGATORS.LOGIN.name,
              },
              [NAVIGATORS.RESET_PASSWORD.name]: {
                path: NAVIGATORS.RESET_PASSWORD.name,
              },
            },
          },
          [NAVIGATORS.USER_PROFILE.name]: 'profile/:userId',
          [NAVIGATORS.POST_DETAILS.name]: 'post/:id',
        },
      },
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer
            ref={NavigationService.navigationRef}
            linking={linking}>
            <NavigatorWrapper />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    )
  }
}

export default App

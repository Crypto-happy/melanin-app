import { NAVIGATORS } from '../constants/navigators'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import OnboardingNavigator from './OnboardingNavigator'
import MainNavigator from './mainNavigator/MainNavigator'
import { useSelector } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'

const Stack = createStackNavigator()

const AuthorizedNavigator = () => {
  const currentUser = useSelector((state: any) => state.auth.currentUser)
  const followedTopics = get(currentUser, 'followedTopics')

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Navigator>
        {isEmpty(followedTopics) ? (
          <Stack.Screen
            name={NAVIGATORS.ONBOARDING.name}
            component={OnboardingNavigator}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name={NAVIGATORS.MAIN.name}
            component={MainNavigator}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </SafeAreaView>
  )
}

export default AuthorizedNavigator

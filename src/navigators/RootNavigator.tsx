import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import AuthNavigator from './AuthNavigator'
import { NAVIGATORS } from '../constants/navigators'
import { useSelector } from 'react-redux'
import AuthorizedNavigator from './AuthorizedNavigator'
import { WelcomeScreen } from '../features/welcome'

const Stack = createStackNavigator()

const RootNavigator = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn)

  return (
    <Stack.Navigator screenOptions={{ header: () => null }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name={NAVIGATORS.WELCOME.name}
            component={WelcomeScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen name={NAVIGATORS.AUTH.name} component={AuthNavigator} />
        </>
      ) : (
        <Stack.Screen
          name={NAVIGATORS.AUTHORIZED.name}
          component={AuthorizedNavigator}
        />
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator

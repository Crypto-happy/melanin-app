import { createStackNavigator } from '@react-navigation/stack'
import { NAVIGATORS } from '../constants/navigators'
import React from 'react'
import { LoginScreen } from '../features/login'
import { RegisterScreen } from '../features/register'
import { ForgotPasswordScreen } from '../features/forgot-password'
import { ResetPasswordScreen } from '../features/reset-password'
import { BusinessCategoriesScreen } from 'features/business-categories'
import { SafeAreaView } from 'react-native-safe-area-context'

const Stack = createStackNavigator()

const AuthNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Navigator>
        <Stack.Screen name={NAVIGATORS.LOGIN.name} component={LoginScreen} />

        <Stack.Screen
          name={NAVIGATORS.REGISTER.name}
          component={RegisterScreen}
        />

        <Stack.Screen
          name={NAVIGATORS.FORGOT_PASSWORD.name}
          component={ForgotPasswordScreen}
        />

        <Stack.Screen
          name={NAVIGATORS.RESET_PASSWORD.name}
          component={ResetPasswordScreen}
        />

        <Stack.Screen
          name={NAVIGATORS.BUSINESS_CATEGORIES.name}
          component={BusinessCategoriesScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

export default AuthNavigator

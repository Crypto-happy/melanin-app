import { createStackNavigator } from '@react-navigation/stack'
import { NAVIGATORS } from '../constants/navigators'
import React from 'react'
import { FollowTopicsScreen } from '../features/follow-topics'

const Stack = createStackNavigator()

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={NAVIGATORS.FOLLOW_TOPICS.name}
        component={FollowTopicsScreen}
      />
    </Stack.Navigator>
  )
}

export default OnboardingNavigator

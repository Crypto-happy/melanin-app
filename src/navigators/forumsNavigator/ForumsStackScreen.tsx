import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { get } from 'lodash'
import { FONT_FAMILIES } from 'constants/fonts'
import { NAVIGATORS } from 'constants/navigators'
import COLORS from 'constants/colors'
import localization from 'localization'
import Icon, { IconType } from 'components/Icon/Icon'
import {
  ForumInterestCategories,
  ForumInterestSubCategories,
} from 'features/select-forum-interests'

const ForumsStack = createStackNavigator()
const ForumsStackScreen = () => (
  <ForumsStack.Navigator
    screenOptions={(props) => ({
      headerTitleStyle: {
        fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
      },
      headerLeft: () => {
        const {
          navigation,
          route: { params },
        } = props
        const headerTitle = get(
          params,
          'headerTitle',
          localization.forums.screenTitle.selectYourInterest,
        )
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={() => {
                navigation.goBack()
              }}>
              <Icon
                type={IconType.MaterialIcons}
                name={'arrow-back'}
                color={COLORS.black}
                size={30}
              />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>{headerTitle}</Text>
          </View>
        )
      },
      headerTitle: null,
    })}>
    <ForumsStack.Screen
      name={NAVIGATORS.SELECT_INTEREST_CATEGORIES.name}
      component={ForumInterestCategories}
    />
    <ForumsStack.Screen
      name={NAVIGATORS.SELECT_INTEREST_SUB_CATEGORIES.name}
      component={ForumInterestSubCategories}
    />
    <ForumsStack.Screen
      name={NAVIGATORS.FORUMS_DISCOVER.name}
      component={ForumInterestSubCategories}
    />
  </ForumsStack.Navigator>
)

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginEnd: 17,
    marginStart: 17,
  },
  screenTitle: {
    color: COLORS.black,
    fontSize: 20,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
})

export default ForumsStackScreen

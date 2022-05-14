import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import COLORS from '../constants/colors'
import Icon from '../components/Icon'
import { IconType } from '../components/Icon/Icon'
import { NAVIGATORS } from '../constants/navigators'
import { showMenu } from '../navigators/helpers'
import {
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
} from '@react-navigation/stack/lib/typescript/src/types'
import { FONT_FAMILIES } from '../constants/fonts'

export const getScreenOptions = (options: any, navigation?: any) => {
  const {
    showLogo = true,
    showBackButton = false,
    title,
    showSearchButton = false,
    showMenuButton = false,
    clickMenu = () => {},
    onBackButtonPress,
  } = options

  return {
    headerRight: (props: StackHeaderLeftButtonProps) => {
      if (!showMenuButton && !showSearchButton) {
        return null
      }
      return (
        <>
          <View style={headerStyles.buttonContainer}>
            {showSearchButton && (
              <TouchableOpacity
                style={headerStyles.searchButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={(e) => navigation.navigate(NAVIGATORS.SEARCH.name)}>
                <Icon
                  type={IconType.MaterialIcons}
                  name={'search'}
                  color={COLORS.cornFlowerBlue}
                  size={24}
                />
              </TouchableOpacity>
            )}
            {showMenuButton && (
              <TouchableOpacity
                style={headerStyles.backButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                onPress={() => {
                  navigation.dispatch(showMenu())
                }}>
                <Icon
                  type={IconType.Entypo}
                  name={'menu'}
                  color={COLORS.black}
                  size={30}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      )
    },
    headerTitle: (props: StackHeaderTitleProps) => (
      <Text style={headerStyles.title}>{title || props.children}</Text>
    ),
    headerLeft: (props: StackHeaderLeftButtonProps) => {
      if (!showLogo && !showBackButton) {
        return null
      }

      const { onPress } = props
      const leftButtonPress = onPress ? onPress : onBackButtonPress

      return (
        <>
          {showLogo && (
            <Image
              source={require('../assets/images/short-logo.png')}
              style={headerStyles.logo}
            />
          )}
          {showBackButton && (
            <TouchableOpacity
              style={headerStyles.backButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={leftButtonPress}>
              <Icon
                type={IconType.MaterialIcons}
                name={'arrow-back'}
                color={COLORS.black}
                size={30}
              />
            </TouchableOpacity>
          )}
        </>
      )
    },
    headerLeftContainerStyle: headerStyles.headerLeftContainer,
    headerTitleAlign: 'left',
    headerStyle: headerStyles.container,
  }
}

const headerStyles = StyleSheet.create({
  container: {
    elevation: 0,
    shadowOpacity: 0,
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 17,
  },
  title: {
    color: COLORS.black,
    fontSize: 18,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  backButton: {
    marginRight: 17,
  },
  headerLeftContainer: {
    paddingHorizontal: 0,
    paddingLeft: 20,
  },
  headerRightButton: {
    padding: 11,
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  searchButton: {
    paddingHorizontal: 5,
  },
})

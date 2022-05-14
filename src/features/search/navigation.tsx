import React from 'react'
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'
import localizedStrings from 'localization'
import DefaultInput from '../../components/DefaultInput'

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

interface MakeSearchOptionFunc {
  (
    searchKeyword: string,
    handleSearchChange: (text: string) => void,
    searchBlur: () => void,
    placeholder?: string,
  ): void
}

export const makeSearchOptions: MakeSearchOptionFunc = (
  searchKeyword = '',
  handleSearchChange = () => {},
  searchBlur = () => {},
  placeholder = localizedStrings.search.placeholder,
): any => {
  return {
    headerLeft: (props: any) => (
      <>
        <TouchableOpacity
          style={styles.backButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={props.onPress}>
          <Icon
            type={IconType.MaterialIcons}
            name={'arrow-back'}
            color={COLORS.black}
            size={30}
          />
        </TouchableOpacity>
      </>
    ),

    headerTitle: () => (
      <DefaultInput
        style={styles.searchInputStyle}
        containerStyle={styles.searchInputContainer}
        autoCapitalize={'none'}
        value={searchKeyword}
        onChangeText={(text: string) => handleSearchChange(text)}
        onBlur={searchBlur}
        placeholder={placeholder}
      />
    ),
    headerRight: () => (
      <View style={styles.rightContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={() => {}}>
          <Icon
            type={IconType.MaterialIcons}
            name={'search'}
            color={COLORS.cornFlowerBlue}
            size={24}
          />
        </TouchableOpacity>
      </View>
    ),
    headerLeftContainerStyle: styles.headerLeftContainer,
    headerRightContainerStyle: styles.headerRightContainer,
    headerTitleAlign: 'center',
    headerStyle: styles.container,
  }
}

const styles = StyleSheet.create({
  container: {
    elevation: 1,
    shadowOpacity: 0,
  },
  searchInputStyle: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.black,
  },
  searchInputContainer: {
    alignItems: 'stretch',
    flex: 1,
    paddingLeft: 10,
    fontSize: 25,
    borderBottomWidth: 0,
    width: SCREEN_WIDTH - 80,
    marginVertical: -20,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    marginLeft: 0,
  },
  backButton: {
    paddingHorizontal: 7,
  },
  rightContainer: {
    flex: 0,
  },
  searchButton: {
    paddingHorizontal: 10,
  },
  headerLeftContainer: {
    flex: 0,
    paddingHorizontal: 0,
  },
  headerRightContainer: {
    flex: 0,
    paddingHorizontal: 0,
  },
})

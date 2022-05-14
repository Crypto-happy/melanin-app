import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {
  StackHeaderLeftButtonProps,
  StackHeaderTitleProps,
} from '@react-navigation/stack/lib/typescript/src/types'
import localizedStrings from 'localization'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'

export const getChatScreenOptions = (props: any) => {
  const {
    pressOnSearch,
    isSearching = false,
    searchText = '',
    onSearchTextChanged,
  } = props

  return {
    headerTitle: (props: StackHeaderTitleProps) => {
      if (isSearching) {
        return (
          <TextInput
            // ref={(ref) => (this.reviewInputRef = ref)}
            style={[
              headerStyles.searchInput,
              Platform.OS === 'android' && { width: '99%' },
              Platform.OS === 'ios' && { paddingBottom: 14 },
            ]}
            multiline={true}
            placeholder={'Search'}
            defaultValue={searchText}
            onChangeText={onSearchTextChanged}
          />
        )
      }

      return (
        <Text style={headerStyles.title}>
          {localizedStrings.chat.headerTitle}
        </Text>
      )
    },
    headerRight: (props: StackHeaderLeftButtonProps) => (
      <TouchableOpacity
        style={headerStyles.searchButton}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        onPress={pressOnSearch}>
        <Icon
          type={IconType.AntDesign}
          name={'search1'}
          color={isSearching ? COLORS.easternBlue : COLORS.black}
          size={24}
        />
      </TouchableOpacity>
    ),
  }
}

const headerStyles = StyleSheet.create({
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  searchButton: {
    marginLeft: 17,
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    paddingTop: 14,
    paddingHorizontal: 10,
    marginVertical: 20,
    textAlignVertical: 'top',
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    borderRadius: 6,
    minHeight: 50,
  },
})

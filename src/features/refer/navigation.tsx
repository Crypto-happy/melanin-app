import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'
import localizedStrings from 'localization'

export const makeReferOptions = () => {
  return {
    headerLeft: (props: any) => (
      <>
        <TouchableOpacity
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
      <Text style={styles.title}>{localizedStrings.refer.title}</Text>
    ),
    headerLeftContainerStyle: styles.headerLeftContainer,
    headerTitleAlign: 'left',
    headerStyle: styles.container,
  }
}

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    color: COLORS.black,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    marginLeft: 20,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginHorizontal: 14,
  },
  shareButton: {
    marginRight: 14,
  },
  logoBrandYoutube: {
    width: 40,
    resizeMode: 'contain',
    marginRight: 6,
  },
  logoBrandInsta: {
    width: 40,
    resizeMode: 'contain',
    marginRight: 20,
  },
  headerLeftContainer: {
    paddingHorizontal: 0,
    paddingLeft: 20,
  },
})

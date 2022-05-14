import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'
import localizedStrings from 'localization'

export const makeProfileOptions = (
  settingsHandler: () => void,
  editHandler: () => void,
  shareHandler: () => void,
) => {
  return {
    headerLeft: () => (
      <View>
        <Text style={styles.title}>{localizedStrings.profile.title}</Text>
      </View>
    ),
    headerTitle: () => null,
    headerRight: () => (
      <View style={styles.rightContainer}>
        <TouchableOpacity
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={() => settingsHandler()}>
          <Icon
            type={IconType.FontAwesome}
            name={'gear'}
            color={COLORS.black}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={() => editHandler()}>
          <Icon
            type={IconType.MaterialIcons}
            name={'mode-edit'}
            color={COLORS.black}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          onPress={() => shareHandler()}>
          <Icon
            type={IconType.Entypo}
            name={'share'}
            color={COLORS.black}
            size={24}
          />
        </TouchableOpacity>
      </View>
    ),
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
})

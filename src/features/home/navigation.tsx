import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'
import localizedStrings from 'localization'

export const makeProfileOptions = (
  editHandler: () => void,
) => {
  return {
    headerLeft: () => (
      <View>
        <Text style={styles.title}>MelaninPeople</Text>
      </View>
    ),
    headerTitle: () => null,
    headerRight: () => (
      <View style={styles.rightContainer}>
        <TouchableOpacity
             onPress={() => editHandler()}
              style={{alignSelf:'flex-end'}}
              // hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
              <Icon
                type={IconType.MaterialCommunityIcons}
                name={'magnify'}
                color='#289FB9'
                size={30}
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
    right:10

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

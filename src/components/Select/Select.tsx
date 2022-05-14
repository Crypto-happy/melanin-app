import React from 'react'
import {
  PixelRatio,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import localizedStrings from 'localization'
import { isEmpty } from 'lodash'

interface SelectProps extends ViewProps {
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  label?: string
  labelStyle?: TextStyle
  placeholder?: string
  text: string
  onPress: () => void
}

const Select = (props: SelectProps) => {
  const {
    style,
    containerStyle,
    textStyle,
    text,
    onPress,
    label,
    labelStyle,
    placeholder = localizedStrings.common.select,
  } = props

  const textContent = isEmpty(text) ? placeholder : text

  return (
    <View style={[styles.touchable, style]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={onPress}>
        <Text
          style={[isEmpty(text) ? styles.placeholder : styles.text, textStyle]}>
          {textContent}
        </Text>
        <Icon
          type={IconType.MaterialCommunityIcons}
          name={'chevron-right'}
          color={COLORS.midGray}
          size={20}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'stretch',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: COLORS.midGray,
    borderRadius: 3,
  },
  text: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.black,
  },
  label: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.black,
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.midGray,
  },
})

export default Select

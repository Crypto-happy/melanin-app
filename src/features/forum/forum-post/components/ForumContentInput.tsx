import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native'
import COLORS from 'constants/colors'
import Icon, { IconType } from 'components/Icon/Icon'
import { FONT_FAMILIES } from 'constants/fonts'

interface Props extends TextInputProps {
  containerStyle?: ViewStyle
  textInputStyle?: ViewStyle
  titleText: string
  hasError?: boolean
  iconType?: IconType
  iconName?: string
}

const ForumContentInput = ({
  titleText,
  hasError = false,
  iconType,
  iconName,
  textInputStyle,
  ...rest
}: Props) => {
  const [isFocusing, setIsFocusing] = useState(false)

  const onFocusHandler = () => {
    setIsFocusing(true)
  }

  const onBlurHandler = () => {
    setIsFocusing(false)
  }

  const getColor = () => {
    if (hasError) {
      return COLORS.coral
    }
    if (isFocusing) {
      return COLORS.oceanGreen
    }
    return COLORS.silver
  }

  const color = getColor()
  const currentContainerStyle = { borderColor: color }

  return (
    <View style={[styles.container, currentContainerStyle]}>
      <Text style={[styles.title, { color }]}>
        {titleText.toLocaleUpperCase()}
      </Text>

      <View style={styles.textInputContainer}>
        {iconType && iconName && (
          <Icon
            type={iconType}
            name={iconName}
            size={25}
            color={color}
            style={styles.icon}
          />
        )}
        <TextInput
          underlineColorAndroid={'transparent'}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          style={[styles.textInput, textInputStyle]}
          {...rest}
        />
      </View>
    </View>
  )
}

export default ForumContentInput

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    paddingHorizontal: 10,
  },
  textInput: {
    padding: 10,
  },
})

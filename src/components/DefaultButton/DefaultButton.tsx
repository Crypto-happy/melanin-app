import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import { isEmpty } from 'lodash'
import LinearGradient from 'react-native-linear-gradient'
import COLORS from '../../constants/colors'

export interface DefaultButtonProps extends TouchableOpacityProps {
  contentContainerStyle?: ViewStyle
  styledColors?: Array<string>
  text: string
  onPress: () => void
  isDisabled?: boolean
}

const DefaultButton = (props: DefaultButtonProps) => {
  const {
    contentContainerStyle,
    styledColors = [],
    style,
    text,
    onPress,
    isDisabled = false,
  } = props

  let colors: (string | number)[] = []
  if (isDisabled) {
    colors.push(COLORS.overlay, COLORS.overlay)
  } else if (!isEmpty(styledColors)) {
    colors = styledColors
  } else {
    colors.push(COLORS.easternBlue, COLORS.oceanGreen)
  }

  return (
    <TouchableOpacity
      style={[styles.touchable, style]}
      onPress={onPress}
      disabled={isDisabled}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[...colors]}
        style={[styles.container, contentContainerStyle]}>
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'stretch',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 6,
  },
  text: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
})

export default DefaultButton

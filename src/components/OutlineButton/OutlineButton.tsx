import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import COLORS from '../../constants/colors'

export interface OutlineButtonProps extends TouchableOpacityProps {
  contentContainerStyle?: ViewStyle
  text: string
  onPress: () => void
  isDisabled?: boolean
  textStyle?: any
}

const OutlineButton = (props: OutlineButtonProps) => {
  const { style, text, textStyle, onPress, isDisabled = false } = props

  return (
    <TouchableOpacity
      style={[styles.container, style, isDisabled && styles.disabledContainer]}
      onPress={onPress}
      disabled={isDisabled}>
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 47,
    borderRadius: 5,
    borderColor: COLORS.oceanGreen,
    borderWidth: 2,
  },
  text: {
    color: COLORS.easternBlue,
    fontSize: 13,
    fontWeight: '600',
  },
  disabledContainer: {
    opacity: 0.5,
  },
})

export default OutlineButton

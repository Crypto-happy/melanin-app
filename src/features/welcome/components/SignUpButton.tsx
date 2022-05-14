import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'
import COLORS from '../../../constants/colors'

export interface DefaultButtonProps extends TouchableOpacityProps {
  onPress: () => void
  contentContainerStyle?: ViewStyle
  text: string
}

const SignUpButton = (props: DefaultButtonProps) => {
  const { contentContainerStyle, style, text, onPress } = props
  return (
    <TouchableOpacity style={[styles.touchable, style]} onPress={onPress}>
      <View style={[styles.container, contentContainerStyle]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {},
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  text: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: '600',
  },
})

export default SignUpButton

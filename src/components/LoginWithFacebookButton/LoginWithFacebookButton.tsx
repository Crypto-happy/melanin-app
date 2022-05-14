import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'
import COLORS from '../../constants/colors'
import Icon from '../Icon'
import { IconType } from '../Icon/Icon'

export interface DefaultButtonProps extends TouchableOpacityProps {
  onPress: () => void
  contentContainerStyle?: ViewStyle
  text: string
}

const LoginWithFacebookButton = (props: DefaultButtonProps) => {
  const { contentContainerStyle, style, text, onPress } = props
  return (
    <TouchableOpacity style={[styles.touchable, style]} onPress={onPress}>
      <View style={[styles.container, contentContainerStyle]}>
        <Icon
          type={IconType.MaterialCommunityIcons}
          name={'facebook'}
          color={COLORS.white}
          size={20}
        />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {},
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 47,
    borderRadius: 5,
    backgroundColor: COLORS.sanMarino,
  },
  text: {
    marginLeft: 10,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
})

export default LoginWithFacebookButton

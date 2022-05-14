import React from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'
import COLORS from '../../constants/colors'
import Icon from '../Icon'
import { IconType } from '../Icon/Icon'

export interface DefaultAvatarProps {
  touchable?: boolean
  onPress?: () => void
  style?: ViewStyle
  iconSize?: number
}

const DefaultAvatar = (props: DefaultAvatarProps) => {
  const { touchable = false, onPress, style, iconSize = 35 } = props

  const containerStyle = {
    backgroundColor: COLORS.lightOceanGreen,
    justifyContent: 'center',
    alignItems: 'center',
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    overflow: 'hidden',
  }

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      disabled={!touchable}
      onPress={onPress}>
      <Icon
        type={IconType.Ionicons}
        name={'ios-person'}
        color={COLORS.silver}
        size={iconSize}
      />
    </TouchableOpacity>
  )
}

export default DefaultAvatar

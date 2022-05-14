import React from 'react'
import { Image, View, ViewStyle } from 'react-native'
import DefaultAvatar from 'components/DefaultAvatar'
import { USER_STATUS } from 'constants'
import COLORS from 'constants/colors'

export interface CustomUserAvatarProps {
  uri: string
  size: number
  containerStyle?: ViewStyle
  status?: USER_STATUS
  showStatus?: boolean
}

const CustomUserAvatar = (props: CustomUserAvatarProps) => {
  const {
    size,
    uri,
    containerStyle,
    status = USER_STATUS.OFFLINE,
    showStatus = false,
  } = props

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  }

  const statusDotStyle = {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderColor: COLORS.white,
    borderWidth: 2,
    backgroundColor:
      status === USER_STATUS.ONLINE ? COLORS.lightGreen : COLORS.silver,
    position: 'absolute',
    top: size / 2 + (size / 2) * Math.cos(0.5) - 5,
    right: size / 2 + (size / 2) * Math.sin(0.5) - 5,
  }

  return (
    <View style={containerStyle}>
      {uri ? (
        <Image source={{ uri }} style={avatarStyle} />
      ) : (
        <DefaultAvatar iconSize={size} />
      )}

      {showStatus && <View style={statusDotStyle} />}
    </View>
  )
}

export default CustomUserAvatar

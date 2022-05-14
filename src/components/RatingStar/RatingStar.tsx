import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from '../Icon'
import { IconType } from '../Icon/Icon'
import COLORS from 'constants/colors'

interface Props {
  point: number
  currentRating: number
  iconSize: number
  unratedIconType?: string
  unratedIconName?: string
  unratedIconColor?: string
  ratedIconType?: string
  ratedIconName?: string
  ratedIconColor?: string
  onSelectPoint?: (point: number) => void
}

const RatingStar = (props: Props) => {
  const {
    point,
    currentRating,
    iconSize,
    unratedIconType,
    unratedIconName,
    unratedIconColor,
    ratedIconType,
    ratedIconName,
    ratedIconColor,
    onSelectPoint,
  } = props

  const isRated = point <= currentRating
  const iconType: any = isRated ? ratedIconType : unratedIconType
  const iconName: any = isRated ? ratedIconName : unratedIconName
  const iconColor: any = isRated ? ratedIconColor : unratedIconColor
  const handleOnSelect = () => onSelectPoint?.(point)

  return (
    <TouchableOpacity style={styles.wrapper} onPress={handleOnSelect}>
      <Icon type={iconType} name={iconName} color={iconColor} size={iconSize} />
    </TouchableOpacity>
  )
}

RatingStar.defaultProps = {
  point: 1,
  currentRating: 0,
  iconSize: 16,
  unratedIconType: IconType.Feather,
  unratedIconName: 'star',
  unratedIconColor: COLORS.geyser,
  ratedIconType: IconType.FontAwesome,
  ratedIconName: 'star',
  ratedIconColor: COLORS.ratingStar,
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
})

export default RatingStar

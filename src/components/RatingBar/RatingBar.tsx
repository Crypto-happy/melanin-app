import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { isEmpty } from 'lodash'

import RatingStar from '../RatingStar'

interface Props extends ViewProps {
  minPoint: number
  maxPoint: number
  step: number
  rating: number
  iconSize: number
  gapBetweenIcon?: number
  iconColor?: string
  isIndicator?: boolean
  onPointChanged?: (point: number) => void
}

const RatingBar = (props: Props) => {
  const {
    minPoint,
    maxPoint,
    step,
    rating,
    onPointChanged,
    style,
    iconSize,
    gapBetweenIcon,
    iconColor,
    isIndicator
  } = props

  const gap: any = isEmpty(gapBetweenIcon) ? iconSize * 0.675 : gapBetweenIcon
  const maxWidth = iconSize * maxPoint + gap * maxPoint

  let items = []
  for (let point = minPoint; point <= maxPoint; point += step) {
    items.push(
      <RatingStar
        key={point}
        point={point}
        currentRating={rating}
        iconSize={iconSize}
        ratedIconColor={iconColor}
        onSelectPoint={(point) => {
          return isIndicator !== true && onPointChanged && onPointChanged(point)
        }
        }
      />,
    )
  }

  return (
    <View style={[styles.container, { maxWidth: maxWidth }, style]}>
      {items}
    </View>
  )
}

RatingBar.defaultProps = {
  minPoint: 1,
  maxPoint: 5,
  step: 1,
  rating: 5,
  iconSize: 24,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default RatingBar

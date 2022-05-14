import React, { useState, useEffect } from 'react'
import { Image, ImageProps, PixelRatio } from 'react-native'
import COLORS from 'constants/colors'
import { isEmpty, isNumber } from 'lodash'
import FastImage from 'react-native-fast-image'
import { AttachmentSize } from '../../types/Attachment.types'

export interface AutoHeightImageProps extends ImageProps {
  width: number
  source: {
    uri: string
  }
  style?: any
  originalWidth?: number
  originalHeight?: number
  size: AttachmentSize
}

interface State {
  height: number
}

const getScaledHeight = (props: AutoHeightImageProps) => {
  const { width: widthProp, size } = props

  if (isEmpty(size)) {
    return 200
  }

  const { originalWidth, originalHeight, width, height } = size

  if (widthProp === width) {
    return height
  }

  if (
    !isNumber(originalWidth) ||
    originalWidth === 0 ||
    !isNumber(originalHeight)
  ) {
    return height
  }

  const ratio = widthProp / originalWidth!
  return originalHeight! * ratio
}

const AutoHeightImage = (props: AutoHeightImageProps) => {
  const { source, width, style, ...rest } = props
  const height = getScaledHeight(props)

  const imageStyle = { width, height, backgroundColor: COLORS.geyser }

  return <FastImage source={source} style={[style, imageStyle]} {...rest} />
}

export default AutoHeightImage

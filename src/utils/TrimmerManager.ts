import React from 'react'
import { Image, NativeModules, Platform } from 'react-native'

const { RNTrimmerManager } = NativeModules

const getActualSource = (source: any) => {
  if (typeof source === 'number') {
    return Image.resolveAssetSource(source).uri
  }
  return source
}

const getThumbnail = (param: any) => {
  const { second, format, source, maximumSize } = param || {}
  const newSource = getActualSource(source)
  return new Promise((resolve, reject) => {
    RNTrimmerManager.getPreviewImageAtPosition(
      newSource,
      second,
      maximumSize,
      format,
    )
      .then((res: any) => {
        let data = res
        if (Platform.OS === 'ios') {
          data = { image: res[0] }
        }
        resolve(data)
      })
      .catch((e) => reject(e))
  })
}

export default { getThumbnail }

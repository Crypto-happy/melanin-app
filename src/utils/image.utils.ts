import { isNumber } from 'lodash'
import { AutoHeightImageProps } from '../components/AutoHeightImage/AutoHeightImage'
import { Image } from 'react-native'

const calculateScaledHeight = ({
  originalWidth,
  originalHeight,
  width,
  defaultHeight,
}: any) => {
  if (
    !isNumber(originalWidth) ||
    originalWidth === 0 ||
    !isNumber(originalHeight)
  ) {
    return defaultHeight
  }

  const ratio = width / originalWidth!
  return originalHeight! * ratio
}

export const getImageSize = (
  imageUrl: string,
  width: number,
  defaultHeight: number,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      imageUrl,
      (originalWidth, originalHeight) => {
        const height = calculateScaledHeight({
          originalWidth,
          originalHeight,
          width,
          defaultHeight,
        })

        return resolve({ originalWidth, originalHeight, width, height })
      },
      (error) => {
        return resolve({
          originalWidth: 0,
          originalHeight: 0,
          width,
          height: defaultHeight,
        })
      },
    )
  })
}

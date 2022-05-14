import React, { useEffect, useState } from 'react'
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Modal,
  ModalProps,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native'
import COLORS from 'constants/colors'
import ImageViewer from 'react-native-image-zoom-viewer'
import { FONT_FAMILIES } from '../../constants/fonts'

export interface FullscreenImageModalProps extends ModalProps {
  sourceUrls: any[]
  source: ImageSourcePropType
  imageStyle?: ImageStyle
  containerStyle?: ViewStyle
  onClose: () => void
}

interface IndicatorProps {
  currentIndex?: number
  allSize?: number
}

const Indicator = (props: IndicatorProps) => {
  const { currentIndex = 0, allSize = 0 } = props

  return <Text style={styles.indicator}>{currentIndex + ' / ' + allSize}</Text>
}

const FullscreenImageModal = (props: FullscreenImageModalProps) => {
  const {
    imageStyle,
    containerStyle,
    onClose,
    sourceUrls = [],
    ...rest
  } = props
  const [images, setImages] = useState<any[]>([])

  useEffect(() => {
    setImages(sourceUrls.map((url) => ({ url })))
  }, [])

  return (
    <Modal {...rest} onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, containerStyle]}>
        <ImageViewer
          enableSwipeDown={true}
          onCancel={onClose}
          imageUrls={images}
          renderIndicator={(currentIndex, allSize) => (
            <Indicator currentIndex={currentIndex} allSize={allSize} />
          )}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 15,
    backgroundColor: 'red',
  },
  closeButtonIOS: {
    position: 'absolute',
    top: 40,
    right: 15,
    backgroundColor: 'red',
  },

  /* Indicator */
  indicator: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 16,
    color: COLORS.white,
  },
})

export default FullscreenImageModal

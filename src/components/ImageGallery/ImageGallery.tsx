import React from 'react'
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import AutoHeightImage from 'components/AutoHeightImage'
import FullscreenImageModal from 'components/FullscreenImageModal'
import { AttachmentSize } from '../../types/Attachment.types'

export interface ImageGalleryProps {
  images: string[]
  containerStyle?: ViewStyle
  paddingHorizontal?: number
  attachmentSize?: AttachmentSize
  onPress?: () => void
}

interface State {
  imageSize: number
  fullSize: number
  viewingUrl: string
  showFullscreenModal: boolean
}

const GAP = 10
const NUMBER_OF_IMAGES_PER_ROW = 2

class ImageGallery extends React.PureComponent<ImageGalleryProps, State> {
  private backHandler: any

  constructor(props: ImageGalleryProps) {
    super(props)

    this.state = {
      imageSize: 0,
      fullSize: 0,
      viewingUrl: '',
      showFullscreenModal: false,
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { paddingHorizontal = 0 } = this.props
    const {
      nativeEvent: {
        layout: { width },
      },
    } = event

    const imageSize =
      (width - paddingHorizontal * 2) / NUMBER_OF_IMAGES_PER_ROW -
      ((NUMBER_OF_IMAGES_PER_ROW - 1) * GAP) / 2

    this.setState({
      imageSize,
      fullSize: width - paddingHorizontal * 2,
    })
  }

  onImagePress = (url: string) => {
    this.setState({
      viewingUrl: url,
      showFullscreenModal: true,
    })
  }

  onFullscreenModalClose = () => {
    this.setState({
      viewingUrl: '',
      showFullscreenModal: false,
    })
  }

  render() {
    const { images, containerStyle, onPress, attachmentSize } = this.props
    const { imageSize, fullSize, viewingUrl, showFullscreenModal } = this.state
    const isSingleImage = images.length === 1
    const imageStyle = {
      width: imageSize,
      height: imageSize,
      marginBottom: GAP,
    }

    return (
      <View style={[styles.container, containerStyle]} onLayout={this.onLayout}>
        {isSingleImage ? (
          <TouchableOpacity
            key={Date.now()}
            style={styles.singleTouchable}
            onPress={onPress ?? (() => this.onImagePress(images[0]))}>
            <AutoHeightImage
              key={Date.now()}
              width={fullSize}
              size={attachmentSize!}
              source={{ uri: images[0] }}
            />
          </TouchableOpacity>
        ) : (
          <>
            {images.map((image, index: number) => (
              <TouchableOpacity
                key={`${index}-${encodeURI(image)}`}
                style={styles.multipleTouchable}
                onPress={() => this.onImagePress(image)}>
                <Image source={{ uri: image }} style={imageStyle} />
              </TouchableOpacity>
            ))}
          </>
        )}
        <FullscreenImageModal
          sourceUrls={images}
          visible={showFullscreenModal}
          source={{ uri: viewingUrl }}
          onClose={this.onFullscreenModalClose}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  singleTouchable: {
    width: '100%',
  },
  multipleTouchable: {},
})

export default ImageGallery

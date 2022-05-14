import React from 'react'
import update from 'immutability-helper'
import { get } from 'lodash'
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  Linking,
} from 'react-native'

import { ATTACHMENT_TYPE } from '../../../../types'
import COLORS from '../../../../constants/colors'
import VideoPlayer from 'components/VideoPlayer'
import ImageGallery from 'components/ImageGallery'

export interface AttachmentViewProps {
  attachments: any[]
  onPress?: () => void
  style?: ViewStyle
  onVideoPlay?: () => void
  onVideoPaused?: () => void
  isViewable: boolean
  onVideoProgress?: (currentTime: number) => void
  shouldResumeOnViewable?: boolean
  videoRef?: any
  onPlaybackRateChange?: (rate: number) => void
}

interface State {
  width: number
}

class AttachmentView extends React.PureComponent<AttachmentViewProps, State> {
  videoPlayer: any
  constructor(props: AttachmentViewProps) {
    super(props)

    this.state = {
      width: 0,
    }

    this.videoPlayer = React.createRef()
  }

  componentDidMount(): void {}

  onLayout = (event: LayoutChangeEvent) => {
    this.setState({
      width: event.nativeEvent.layout.width,
    })
  }

  onPhotoAttachmentPress = () => {
    const { onPress } = this.props
    onPress && onPress()
  }

  onLinkAttachmentPress = () => {
    const { attachments } = this.props
    const url = get(attachments, '[0].url')
    if (url) {
      Linking.openURL(url)
    }
  }

  render() {
    const {
      style,
      isViewable,
      onVideoProgress,
      shouldResumeOnViewable,
      videoRef,
      onPlaybackRateChange,
      attachments,
    } = this.props
    const { width } = this.state
    const isVideo = attachments[0].type === ATTACHMENT_TYPE.VIDEO
    const isLink = attachments[0].type === ATTACHMENT_TYPE.LINK
    const imageUrls = isVideo
      ? []
      : isLink
      ? attachments.map((attachment) => attachment.previewUrl)
      : attachments.map((attachment) => attachment.url)

    let attachmentSize = {
      originalWidth: 0,
      originalHeight: 0,
      width: 0,
      height: 0,
    }

    if (imageUrls.length === 1) {
      attachmentSize = update(attachments[0].size, {})
    }

    return (
      <View style={[styles.container, style]} onLayout={this.onLayout}>
        {isVideo ? (
          <VideoPlayer
            videoRef={videoRef}
            isViewable={isViewable}
            source={{ uri: attachments[0].url }}
            style={styles.video}
            width={width}
            previewUrl={attachments[0].previewUrl}
            onProgress={onVideoProgress}
            progressUpdateInterval={500}
            shouldResumeOnViewable={shouldResumeOnViewable}
            onPlaybackRateChange={onPlaybackRateChange}
          />
        ) : isLink ? (
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={this.onLinkAttachmentPress}>
            <ImageGallery
              images={imageUrls}
              onPress={this.onLinkAttachmentPress}
              attachmentSize={attachmentSize}
            />
            <Text style={styles.linkTitle}>{attachments[0].title}</Text>
            <Text style={styles.linkDescription}>
              {attachments[0].description}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={this.onPhotoAttachmentPress}>
            <ImageGallery images={imageUrls} attachmentSize={attachmentSize} />
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  photoContainer: {
    flex: 1,
  },
  photo: {
    resizeMode: 'cover',
    borderRadius: 5,
  },
  playButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    borderRadius: 30,
  },
  playIcon: {},
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    aspectRatio: 1,
    width: '100%',
    backgroundColor: COLORS.black,
  },
  linkTitle: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  linkDescription: {
    color: COLORS.doveGray,
    fontSize: 12,
  },
})

export default AttachmentView

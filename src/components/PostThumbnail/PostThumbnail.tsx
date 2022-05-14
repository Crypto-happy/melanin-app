import React from 'react'
import {Image, StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native'
import Icon from '../Icon'
import { IconType } from '../Icon/Icon'
import COLORS from '../../constants/colors'
import { ATTACHMENT_TYPE } from 'types'
import FastImage from 'react-native-fast-image'

interface Props extends ViewProps {
  imgUrl: string
  type: string
  width: number
  onPress: () => void
}

class PostThumbnail extends React.PureComponent<Props> {
  onThumbnailPress = () => {
    this.props.onPress()
  }

  render() {
    const { imgUrl, width, type } = this.props
    const imageSize: number = width - 40.0
    const imageStyle = { width: imageSize, height: imageSize }

    return (
      <View style={[styles.container, { width }]}>
        <TouchableOpacity
          style={[styles.thumbnailWrapper, imageStyle]}
          onPress={this.onThumbnailPress}>
          <Image style={styles.thumbnail} source={{ uri: imgUrl }} />

          {type === ATTACHMENT_TYPE.VIDEO && (
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <Icon
                  type={IconType.MaterialIcons}
                  name={'play-arrow'}
                  color={COLORS.white}
                  size={40}
                />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  thumbnailWrapper: {
    marginLeft: 0,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.geyser,
  },
  playButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    borderRadius: 30,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default PostThumbnail

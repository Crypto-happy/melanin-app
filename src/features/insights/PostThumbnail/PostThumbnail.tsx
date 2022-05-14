import React from 'react'
import {Image, StyleSheet, TouchableOpacity, View, ViewProps, Text} from 'react-native'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'
import { ATTACHMENT_TYPE } from 'types'
import LinearGradient from 'react-native-linear-gradient'
import numeral from 'numeral'

interface Props extends ViewProps {
  imgUrl: string
  type: string
  width: number
  sharedCount: number
  viewsCount: number
  onPress: () => void
}

class PostThumbnail extends React.PureComponent<Props> {
  onThumbnailPress = () => {
    this.props.onPress()
  }

  render() {
    const { imgUrl, width, type, viewsCount, sharedCount } = this.props
    const imageSize: number = width
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
          <LinearGradient  colors={[COLORS.transparent, COLORS.overlay]} style={styles.bottomContent}>
            <View style={styles.textContainer}>
                <Icon
                  type={IconType.AntDesign}
                  name={'eye'}
                  color={COLORS.white}
                  size={20}
                />
                <Text style={styles.bottomButtonText}>
                  {numeral(viewsCount).format('0a')}
                </Text>
            </View>
            <View style={styles.textContainer}>
                <Icon
                  type={IconType.Entypo}
                  name={'share'}
                  color={COLORS.white}
                  size={20}
                />
                <Text style={styles.bottomButtonText}>
                 {numeral(sharedCount).format('0a')}
                </Text>
              </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  thumbnailWrapper: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 15,
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
  bottomContent:{
    position:'absolute',
    bottom:0,
    right:0,
    width:'100%',
    paddingBottom:10,
    paddingRight:10,
    paddingTop:10,
    justifyContent:'flex-end',
    alignItems:'center',
    flexDirection:'row'
  },
  bottomButtonText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 5,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:10
  },
})

export default PostThumbnail

import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FONT_FAMILIES } from '../../../../constants/fonts'
import COLORS from '../../../../constants/colors'
import { isEmpty, round } from 'lodash'
import AttachmentView from './AttachmentView'
import Icon from '../../../../components/Icon'
import { IconType } from '../../../../components/Icon/Icon'
import DefaultAvatar from '../../../../components/DefaultAvatar'
import moment from 'moment'
import numeral from 'numeral'
import ExpandableText from 'components/ExpandableText/ExpandableText'
import PostTag from 'components/PostTag/PostTag'
import LinearGradient from 'react-native-linear-gradient'

export interface PostItemProps {
  data: any
  onPressViewMore: (id: string) => void
  onRatingButtonPress: (id: string) => void
  onLikesButtonPress: (id: string) => void
  onDislikesButtonPress: (id: string) => void
  onCommentsButtonPress: (id: string) => void
  onAvatarAndUserNamePress: (id: string) => void
  currentUserId: string
  isViewable: boolean
  onShareButtonPress: (id: string) => void
  onPhotoAttachmentPress?: (id: string) => void
}

class PostItem extends React.PureComponent<PostItemProps> {

  onPhotoAttachmentPress = () => {
    const {
      onPhotoAttachmentPress,
      data: { id },
    } = this.props
    onPhotoAttachmentPress && onPhotoAttachmentPress(id)
  }

  renderAttachmentView = (attachments: any[]) => {
    if (isEmpty(attachments)) {
      return null
    }

    return (
      <AttachmentView
        style={styles.attachmentView}
        attachments={attachments}
        isViewable={this.props.isViewable}
        onPress={this.onPhotoAttachmentPress}
      />
    )
  }

  onRatingItemPress = () => {
    const { id } = this.props.data
    this.props.onRatingButtonPress(id)
  }

  onLikesButtonPress = () => {
    const { id } = this.props.data
    this.props.onLikesButtonPress(id)
  }

  onDislikesButtonPress = () => {
    const { id } = this.props.data
    this.props.onDislikesButtonPress(id)
  }

  onCommentsButtonPress = () => {
    const { id } = this.props.data
    this.props.onCommentsButtonPress(id)
  }

  onViewMorePress = () => {
    const { id } = this.props.data
    this.props.onPressViewMore(id)
  }

  handleAvatarAndUserNamePress = () => {
    const {
      data: {
        author: { _id },
      },
      onAvatarAndUserNamePress,
    } = this.props

    onAvatarAndUserNamePress && onAvatarAndUserNamePress(_id)
  }

  handleOriginalPostAvatarAndUserNamePress = () => {
    const {
      data: {
        sharedFrom: {
          author: { _id },
        },
      },
      onAvatarAndUserNamePress,
    } = this.props

    onAvatarAndUserNamePress && onAvatarAndUserNamePress(_id)
  }

  renderSharedPost = (sharedPost: any) => {
    const {
      text,
      author: { avatar, name },
      attachments,
      createdAt,
      tags,
    } = sharedPost
    const formattedCreatedTime = moment(createdAt).fromNow()

    return (
      <View style={styles.childPost}>
        <View style={styles.topInfo}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={this.handleOriginalPostAvatarAndUserNamePress}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.userAvatar} />
            ) : (
              <DefaultAvatar style={styles.userAvatar} iconSize={30} />
            )}
            <Text style={styles.userName} numberOfLines={1}>
              {name}
            </Text>
          </TouchableOpacity>
          <View style={styles.topRightContent}>
            <Text style={styles.createdTime}>{formattedCreatedTime}</Text>
            <TouchableOpacity
              onPress={this.onViewMorePress}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
              <Icon
                type={IconType.Fontisto}
                name={'more-v-a'}
                color={COLORS.silver}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        {!isEmpty(text) && (
          <ExpandableText
            containerStyle={styles.postTextContainer}
            style={styles.postText}>
            {text}
          </ExpandableText>
        )}
        {!isEmpty(tags) && (
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <PostTag text={tag} style={styles.tag} />
            ))}
          </View>
        )}
        {this.renderAttachmentView(attachments)}
      </View>
    )
  }

  onShareButtonPress = () => {
    const { data, onShareButtonPress } = this.props
    const originalPost = isEmpty(data.sharedFrom) ? data : data.sharedFrom
    onShareButtonPress(originalPost.id)
  }

  onViewProductButtonPress = () => {
    const { id } = this.props.data
    this.props.onCommentsButtonPress(id)
  }

  render() {
    const { data, onPressViewMore, currentUserId } = this.props
    const isSharedPost = !isEmpty(data.sharedFrom)
    const {
      text,
      author: { avatar, name },
      attachments,
      createdAt,
      likesCount,
      dislikesCount,
      commentsCount,
      ratingAvg,
      likes,
      dislikes,
      tags,
      viewsCount,
      type,
    } = data

    const formattedCreatedTime = moment(createdAt).fromNow()

    return (
      <View style={styles.container}>
        <View style={styles.topInfo}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={this.handleAvatarAndUserNamePress}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.userAvatar} />
            ) : (
              <DefaultAvatar style={styles.userAvatar} iconSize={30} />
            )}
            <Text style={styles.userName} numberOfLines={1}>
              {name}
            </Text>
          </TouchableOpacity>
          <View style={styles.topRightContent}>
            <Text style={styles.createdTime}>{formattedCreatedTime}</Text>
            <TouchableOpacity
              onPress={this.onViewMorePress}
              hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
              <Icon
                type={IconType.Fontisto}
                name={'more-v-a'}
                color={COLORS.silver}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        {!isEmpty(text) && (
          <ExpandableText
            containerStyle={styles.postTextContainer}
            style={styles.postText}>
            {text}
          </ExpandableText>
        )}
         <View style={[styles.imageContainer]}>

              {this.renderAttachmentView(attachments)}

              <LinearGradient  colors={[COLORS.transparent, COLORS.overlay]} style={[styles.bottomInfo, {position:!!attachments.length ? 'absolute' : 'relative', bottom: attachments.length > 1 ? 10 : 0 }]}>


                  <View style={styles.commentsContainer}>
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

                  <TouchableOpacity

                    onPress={this.onCommentsButtonPress}>
                    <View style={styles.commentsContainer}>
                      <Icon
                        type={IconType.MaterialIcons}
                        name={'mode-comment'}
                        color={COLORS.white}
                        size={20}
                      />
                      <Text style={styles.bottomButtonText}>
                        {numeral(commentsCount).format('0a')}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.ratingButton}
                    onPress={this.onRatingItemPress}>
                    <View style={styles.commentsContainer}>
                      <Icon
                        type={IconType.Ionicons}
                        name={'ios-star'}
                        color={COLORS.white}
                        size={20}
                      />
                      <Text style={styles.bottomButtonText}>
                        {round(ratingAvg, 1)}
                      </Text>
                    </View>
                  </TouchableOpacity>


              </LinearGradient>


          </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    paddingHorizontal: 19,
    paddingBottom:19,
    marginBottom:19,
    width: '100%',
    borderBottomWidth:1,
    borderBottomColor:COLORS.alabaster
  },
  childPost: {
    alignItems: 'stretch',
    paddingLeft: 19,
  },
  topInfo: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  topRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  userName: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
    flex: 1,
  },
  createdTime: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.silver,
    marginRight: 10,
  },
  postText: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 15,
    color: COLORS.black,
  },
  postTextContainer: {
    marginBottom: 11,
  },
  attachmentView: {
    marginBottom: 0,
    borderRadius:5,
    overflow:'hidden'
  },
  bottomInfo: {
    opacity:1,
    bottom:0,
    paddingVertical:10,
    width:'100%',
    position:'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButton: {
    marginRight: 15,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButtonText: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 11,
    color: COLORS.white,
    marginLeft: 10,
  },
  dislikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsContainer: {
    marginHorizontal:6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    marginRight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    marginRight: 5,
    marginBottom: 10,
  },
  viewProductButton: {
    width: 150,
    height: 40,
    marginBottom: 20,
  },
  imageContainer:{
    borderRadius:5,
    position:'relative'
  }
})

export default PostItem

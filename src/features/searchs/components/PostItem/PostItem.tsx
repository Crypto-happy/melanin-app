import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FONT_FAMILIES } from '../../../../constants/fonts'
import COLORS from '../../../../constants/colors'
import { isEmpty, round } from 'lodash'
// import AttachmentView from './AttachmentView'
import Icon from '../../../../components/Icon'
import { IconType } from '../../../../components/Icon/Icon'
import DefaultAvatar from '../../../../components/DefaultAvatar'
import moment from 'moment'
import numeral from 'numeral'
import ExpandableText from 'components/ExpandableText/ExpandableText'
import PostTag from 'components/PostTag/PostTag'
import { POST_TYPE } from 'constants'
import { DefaultButton } from 'components/DefaultButton'

export interface PostItemProps {
  data: any
  // onPressPost(id:string) => void
  onPressPost: (id: string) => void
  // onRatingButtonPress: (id: string) => void
  // onLikesButtonPress: (id: string) => void
  // onDislikesButtonPress: (id: string) => void
  // onCommentsButtonPress: (id: string) => void
  // onAvatarAndUserNamePress: (id: string) => void
  currentUserId: string
  isViewable: boolean
  // onShareButtonPress: (id: string) => void
  // onPhotoAttachmentPress?: (id: string) => void
}

class PostItem extends React.PureComponent<PostItemProps> {
  // onPhotoAttachmentPress = () => {
  //   const {
  //     onPhotoAttachmentPress,
  //     data: { id },
  //   } = this.props
  //   onPhotoAttachmentPress && onPhotoAttachmentPress(id)
  // }

  // renderAttachmentView = (attachments: any[]) => {
  //   if (isEmpty(attachments)) {
  //     return null
  //   }

  //   return (
  //     <AttachmentView
  //       style={styles.attachmentView}
  //       attachments={attachments}
  //       isViewable={this.props.isViewable}
  //       onPress={this.onPhotoAttachmentPress}
  //     />
  //   )
  // }

  // onRatingItemPress = () => {
  //   const { id } = this.props.data
  //   this.props.onRatingButtonPress(id)
  // }
  onPressPostBtn = () => {
    this.props.onPressPost(this.props.data)
  }
  // onLikesButtonPress = () => {
  //   const { id } = this.props.data
  //   this.props.onLikesButtonPress(id)
  // }

  // onDislikesButtonPress = () => {
  //   const { id } = this.props.data
  //   this.props.onDislikesButtonPress(id)
  // }

  // onCommentsButtonPress = () => {
  //   const { id } = this.props.data
  //   this.props.onCommentsButtonPress(id)
  // }

  // onViewMorePress = () => {
  //   const { id } = this.props.data
  //   this.props.onPressViewMore(id)
  // }

  // handleAvatarAndUserNamePress = () => {
  //   const {
  //     data: {
  //       author: { _id },
  //     },
  //     onAvatarAndUserNamePress,
  //   } = this.props

  //   onAvatarAndUserNamePress && onAvatarAndUserNamePress(_id)
  // }

  // handleOriginalPostAvatarAndUserNamePress = () => {
  //   const {
  //     data: {
  //       sharedFrom: {
  //         author: { _id },
  //       },
  //     },
  //     onAvatarAndUserNamePress,
  //   } = this.props

  //   onAvatarAndUserNamePress && onAvatarAndUserNamePress(_id)
  // }

  // renderSharedPost = (sharedPost: any) => {
  //   const {
  //     text,
  //     author: { avatar, name },
  //     attachments,
  //     createdAt,
  //     tags,
  //   } = sharedPost
  //   const formattedCreatedTime = moment(createdAt).fromNow()

  //   return (
  //     <View style={styles.childPost}>
  //       <View style={styles.topInfo}>
  //         <TouchableOpacity
  //           style={styles.userInfo}
  //           onPress={this.handleOriginalPostAvatarAndUserNamePress}>
  //           {avatar ? (
  //             <Image source={{ uri: avatar }} style={styles.userAvatar} />
  //           ) : (
  //             <DefaultAvatar style={styles.userAvatar} iconSize={30} />
  //           )}
  //           <Text style={styles.userName} numberOfLines={1}>
  //             {name}
  //           </Text>
  //         </TouchableOpacity>
  //         <View style={styles.topRightContent}>
  //           <Text style={styles.createdTime}>{formattedCreatedTime}</Text>
  //           <TouchableOpacity
  //             onPress={this.onViewMorePress}
  //             hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
  //             <Icon
  //               type={IconType.Ionicons}
  //               name={'md-more'}
  //               color={COLORS.silver}
  //               size={20}
  //             />
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </View>
  //   )
  // }

  // onShareButtonPress = () => {
  //   const { data, onShareButtonPress } = this.props
  //   const originalPost = isEmpty(data.sharedFrom) ? data : data.sharedFrom
  //   onShareButtonPress(originalPost.id)
  // }

  // onViewProductButtonPress = () => {
  //   const { id } = this.props.data
  //   this.props.onCommentsButtonPress(id)
  // }

  render() {
    // const { data, onPressViewMore, currentUserId } = this.props
    //console.log('//// postItem')
    //console.log(this.props)
    const { data, currentUserId } = this.props
    // const isSharedPost = !isEmpty(data.sharedFrom)
    return (
      <View style={styles.container}>
        <View style={styles.topInfo}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={this.onPressPostBtn}
            >
            <Icon
                type={IconType.MaterialCommunityIcons}
                name={'magnify'}
                color='#289FB9'
                size={30}
              />
            <Text style={styles.userName} numberOfLines={1}>
              {data}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    paddingHorizontal: 19,
    width: '100%',
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
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  createdTime: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.silver,
    marginRight: 10,
  },
  postText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: COLORS.black,
  },
  postTextContainer: {
    marginBottom: 11,
  },
  attachmentView: {
    marginBottom: 20,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 13,
    color: COLORS.black,
    marginLeft: 5,
  },
  dislikesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsContainer: {
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
})

export default PostItem

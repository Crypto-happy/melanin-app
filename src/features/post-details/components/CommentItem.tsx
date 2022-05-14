import React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import DefaultAvatar from 'components/DefaultAvatar'
import { FONT_FAMILIES } from 'constants/fonts'
import ExpandableText from 'components/ExpandableText/ExpandableText'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'
import moment from 'moment'
import localizedStrings from 'localization'
import { DEFAULT_BUTTON_HIT_SLOP } from 'constants'

export interface CommentItemProps {
  data: any
  onLikeCommentButtonPress: (commentId: string) => void
  currentUserId: string
  onReplyButtonPress: (commentId: string) => void
  onAuthorPress: (userId: string) => void
  isPostOwner: boolean
  onCommentViewMore: (
    isPostOwner: boolean,
    commentId: string,
    ownerCommentId: string,
  ) => void
}

class CommentItem extends React.Component<CommentItemProps, any> {
  onLikeButtonPress = (id: string) => {
    const { onLikeCommentButtonPress } = this.props
    onLikeCommentButtonPress(id)
  }

  onReplyButtonPress = () => {
    const {
      data: { id },
      onReplyButtonPress,
    } = this.props
    onReplyButtonPress(id)
  }

  onAuthorPress = (userId: string) => {
    this.props.onAuthorPress(userId)
  }

  renderComment = (comment: any) => {
    const {
      _id,
      author: { avatar, name, _id: userId },
      text,
      createdAt,
      likes,
      isChild = false,
      likesCount = 0,
    } = comment
    const { currentUserId, isPostOwner, onCommentViewMore } = this.props

    const formattedCreatedTime = moment(createdAt).fromNow()
    const liked = likes.includes(currentUserId)
    const isCommentOwner = userId === currentUserId

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.avatarTouchable}
          onPress={() => this.onAuthorPress(userId)}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.userAvatar} />
          ) : (
            <DefaultAvatar style={styles.userAvatar} iconSize={30} />
          )}
        </TouchableOpacity>
        <View style={styles.middleColumn}>
          <TouchableOpacity
            style={styles.userNameTouchable}
            onPress={() => this.onAuthorPress(userId)}>
            <Text style={styles.userName}>{name}</Text>
          </TouchableOpacity>
          <ExpandableText style={styles.commentText}>{text}</ExpandableText>
          <View style={styles.bottomButtonsContainer}>
            <Text style={styles.createdAt}>{formattedCreatedTime}</Text>
            {!isChild && (
              <TouchableOpacity
                style={styles.replyButton}
                hitSlop={DEFAULT_BUTTON_HIT_SLOP}
                onPress={this.onReplyButtonPress}>
                <Text style={styles.replyButtonText}>
                  {localizedStrings.postDetails.reply}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.likeButton}
          hitSlop={DEFAULT_BUTTON_HIT_SLOP}
          onPress={() => this.onLikeButtonPress(_id)}>
          <View style={styles.likesContainer}>
            <Icon
              type={IconType.AntDesign}
              name={liked ? 'heart' : 'hearto'}
              color={COLORS.red}
              size={20}
            />

            {likesCount > 0 && (
              <Text style={styles.likesCount}>{likesCount}</Text>
            )}
          </View>
        </TouchableOpacity>

        {(isCommentOwner || isPostOwner) && (
          <TouchableOpacity
            style={styles.likeButton}
            hitSlop={DEFAULT_BUTTON_HIT_SLOP}
            onPress={() => onCommentViewMore(isPostOwner, _id, userId)}>
            <View style={styles.likesContainer}>
              <Icon
                style={styles.deleteIcon}
                type={IconType.Entypo}
                name="dots-three-vertical"
                color={COLORS.silverChalice}
                size={16}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderChildComment = ({ item }) => {
    return this.renderComment({ ...item, isChild: true })
  }

  renderCommentItemSeparator = () => {
    return <View style={styles.commentItemSeparator} />
  }

  render() {
    const { data } = this.props
    const { children = [] } = data
    return (
      <>
        {this.renderComment(data)}

        <FlatList
          data={children}
          renderItem={this.renderChildComment}
          style={styles.childCommentsList}
          ItemSeparatorComponent={this.renderCommentItemSeparator}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 19,
  },
  avatarTouchable: {
    marginRight: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  middleColumn: {
    flex: 1,
  },
  likeButton: {
    marginLeft: 12,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginRight: 10,
  },
  userNameTouchable: {},
  userName: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: '600',
  },
  commentText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  createdAt: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.silver,
  },
  replyButton: {
    marginLeft: 14,
  },
  replyButtonText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '600',
    fontSize: 12,
    color: COLORS.black,
  },
  childCommentsList: {
    marginLeft: 48,
    marginTop: 14,
  },
  commentItemSeparator: {
    marginVertical: 12,
  },
  likesCount: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    marginLeft: 5,
    color: COLORS.doveGray,
  },
})

export default CommentItem

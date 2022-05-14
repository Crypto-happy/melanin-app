import React from 'react'
import { Image, StyleSheet,Button, Text, TouchableOpacity, View ,TouchableHighlight} from 'react-native'
import { FONT_FAMILIES } from '../../../../constants/fonts'
import COLORS from '../../../../constants/colors'
import { isEmpty, round } from 'lodash'
import Icon from '../../../../components/Icon'
import { IconType } from '../../../../components/Icon/Icon'
import DefaultAvatar from '../../../../components/DefaultAvatar'

export interface PostItemProps {
  data: any
  currentUserId: string
  isViewable: boolean
}

class PostItem extends React.PureComponent<PostItemProps> {
  render() {
    const { data, 
      currentUserId } = this.props
    const isSharedPost = !isEmpty(data.sharedFrom)
    const {
      text,
      avatar,name,
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

    
    const buttonHitSlop = { top: 12, right: 12, bottom: 12, left: 12 }
    return (
      <View style={styles.container}>
        <View style={styles.topInfo}>
          <TouchableOpacity
            style={styles.userInfo}
            // onPress={this.handleAvatarAndUserNamePress}
            >
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
            <TouchableOpacity style={styles.ratingButton}>
              <View style={styles.commentsContainer}>
                <Icon
                  type={IconType.Ionicons}
                  name={'ios-star'}
                  color={COLORS.goldenTainoi}
                  size={15}
                />
                <Text style={styles.bottomButtonText}>
                  {round(ratingAvg, 1)}
                </Text>
              </View>
            </TouchableOpacity>
          <TouchableOpacity 
                style ={{
                  width:100,
                    borderRadius:20,
                    marginLeft :16,
                }}>
            <Button   color="#289FB9" title="Follow"  accessibilityLabel="Learn more about this button"/> 
         </TouchableOpacity> 
          </View>
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

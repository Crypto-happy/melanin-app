import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FONT_FAMILIES } from 'constants/fonts'
import moment from 'moment'
import COLORS from 'constants/colors'
import Badge from 'components/Badge'
import CustomUserAvatar from 'components/CustomUserAvatar'
import { isEmpty, get } from 'lodash'
import { USER_STATUS } from 'constants'

export interface ChatRoomItemProps {
  data: any
  index: number
  onItemPress: (index: number) => void
  currentUser: any
}

class ChatRoomItem extends React.PureComponent<ChatRoomItemProps> {
  onItemPress = () => {
    const { onItemPress, index } = this.props
    onItemPress(index)
  }

  render() {
    const {
      data: { users, unread = 0, latestChatMessage = {} },
      currentUser,
    } = this.props
    const {
      text,
      createdAt: lastChatMessageCreatedAt = Date.now(),
    } = latestChatMessage
    const otherUsers = users.filter((user: any) => user._id !== currentUser._id)

    if (isEmpty(otherUsers)) {
      return null
    }

    const { name, avatar } = otherUsers[0]
    const timeText = moment(lastChatMessageCreatedAt).fromNow()
    const shouldShowUnread = unread > 0
    const status = get(otherUsers, '[0].status', USER_STATUS.OFFLINE)

    return (
      <TouchableOpacity style={styles.touchable} onPress={this.onItemPress}>
        <View style={styles.container}>
          <CustomUserAvatar
            uri={avatar}
            containerStyle={styles.userAvatar}
            size={50}
            status={status}
            showStatus={true}
          />

          <View style={styles.middleContent}>
            <Text style={styles.userName}>{name}</Text>
            {!isEmpty(latestChatMessage) && (
              <Text style={styles.chatMessage}>{text}</Text>
            )}
          </View>

          <View style={styles.rightContent}>
            <Text style={styles.timeText}>{timeText}</Text>

            {shouldShowUnread && (
              <Badge content={unread} style={styles.unreadBadge} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'stretch',
  },
  container: {
    alignItems: 'stretch',
    flexDirection: 'row',
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  userAvatar: {
    marginRight: 21,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'space-around',
  },
  userName: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '600',
  },
  chatMessage: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  rightContent: {
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  timeText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    color: COLORS.silverChalice,
  },
  unreadBadge: {
    width: 27,
    height: 17,
    borderRadius: 9,
  },
})

export default ChatRoomItem

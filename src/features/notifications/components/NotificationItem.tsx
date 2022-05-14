import React, { useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native'
import { FONT_FAMILIES } from 'constants/fonts'
import COLORS from 'constants/colors'
import moment from 'moment'
import DefaultAvatar from '/components/DefaultAvatar'
import { NAVIGATORS } from 'constants/navigators'
import * as NavigationService from 'navigators/NavigationService'

export interface NotifItemProps {
  navigation: any
  data: any
}

const NotificationItem = (props: NotifItemProps) => {
  const {
    data: { item = {} },
  } = props
  if (!item.user) {
    return null
  }
  const {
    message,
    isSeen,
    createdAt,
    type,
    user: { name, avatar },
  } = item
  const formattedCreatedTime = moment(item.createdAt).fromNow()
  let screen: string
  let params: any
  switch (type) {
    case 'follows':
    case 'reviews':
      screen = NAVIGATORS.USER_PROFILE.name
      params = { userId: item.openedId }
      break
    case 'chats':
      screen = NAVIGATORS.CHAT_ROOM.name
      params = { messageId: item.openedId }
      break
    default:
      screen = NAVIGATORS.POST_DETAILS.name
      params = { id: item.openedId }
      break
  }

  const onPressItem = () => {
    props.navigation.navigate(screen, { ...params })
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSeen ? COLORS.white : COLORS.geyser,
        },
      ]}
      onPress={onPressItem}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.userAvatar} />
      ) : (
        <DefaultAvatar style={styles.userAvatar} iconSize={30} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text numberOfLines={6} style={styles.msg}>
          {message}
        </Text>
      </View>
      <Text style={styles.time}>{formattedCreatedTime}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 19,
    paddingVertical: 15,
    flexDirection: 'row',
    borderBottomColor: COLORS.silver,
    borderBottomWidth: 0.5,
  },
  textContainer: {
    paddingLeft: 19,
    flex: 3,
  },
  name: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    fontSize: 15,
    color: COLORS.black,
    marginVertical: 1,
  },
  msg: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    color: COLORS.black,
    paddingRight: 10,
    marginVertical: 1,
  },
  time: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 10,
    color: COLORS.midGray,
    flex: 1,
    textAlign: 'right',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
})

export default NotificationItem

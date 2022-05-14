import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { get, round } from 'lodash'

import localizedStrings from 'localization'
import UserAvatar from '../../../../components/UserAvatar'
import { ACCOUNT_TYPE } from 'types'
import Icon from '../../../../components/Icon'
import { IconType } from '../../../../components/Icon/Icon'
import COLORS from '../../../../constants/colors'
import { STATISTIC_INFO_NAME } from 'constants'
import { DefaultButton } from '../../../../components/DefaultButton'
import { FONT_FAMILIES } from '../../../../constants/fonts'
import { UserType } from '../../../../types/User.types'

interface Props {
  userItemId: string
  user: UserType
  selectedTab: STATISTIC_INFO_NAME
  followedUser: boolean
  onPressAvatarAndUserName: (id: string) => void
  onPressFollowUser: (id: string) => void
}

class FollowListItem extends PureComponent<Props> {
  handlePressAvatarUserName = () => {
    const { userItemId, onPressAvatarAndUserName } = this.props
    onPressAvatarAndUserName(userItemId)
  }

  handlePressFollow = () => {
    const { userItemId, onPressFollowUser } = this.props
    onPressFollowUser(userItemId)
  }

  render() {
    const localization = localizedStrings.followerFollowing
    const { user, selectedTab, followedUser } = this.props

    const ratingAvg = user.ratingAvg || 0

    return (
      <View style={styles.listItemWrapper}>
        <TouchableOpacity onPress={this.handlePressAvatarUserName}>
          <UserAvatar
            imgSrc={user.avatar}
            heightOrWidth={40}
            isBusiness={user.accountType === ACCOUNT_TYPE.BUSINESS}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemName}
          onPress={this.handlePressAvatarUserName}>
          <Text>{user.name}</Text>
        </TouchableOpacity>

        <View style={styles.ratingButton}>
          <View style={styles.ratingContainer}>
            <Icon
              type={IconType.Ionicons}
              name={'ios-star'}
              color={COLORS.goldenTainoi}
              size={15}
            />
            <Text style={styles.bottomButtonText}>{round(ratingAvg, 1)}</Text>
          </View>
        </View>

        {selectedTab === STATISTIC_INFO_NAME.USERS && (
          <DefaultButton
            contentContainerStyle={styles.itemAction}
            text={localization.followButton}
            onPress={this.handlePressFollow}
            isDisabled={followedUser || !!user.isFollowing}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.alabaster,
  },
  itemName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    marginHorizontal: 15,
  },
  itemAction: {
    maxHeight: 26,
  },
  ratingButton: {
    marginRight: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButtonText: {
    fontFamily: FONT_FAMILIES.OPEN_SANS,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.silver,
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingModalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  ratingModalContent: {
    marginHorizontal: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    elevation: 2,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: COLORS.black,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    borderRadius: 5,
  },
})

export default FollowListItem

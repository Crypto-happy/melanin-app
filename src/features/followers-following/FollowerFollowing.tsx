import React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import update from 'immutability-helper'
import { isEmpty, get } from 'lodash'

import localizedStrings from 'localization'
import COLORS from '../../constants/colors'
import { STATISTIC_INFO_NAME } from 'constants'
import { RootStackParamList } from 'navigators/RootStackParamList'
import { UserType } from 'types/User.types'
import UserAvatar from 'components/UserAvatar'
import { ACCOUNT_TYPE } from 'types'
import { DefaultButton } from 'components/DefaultButton'
import { NAVIGATORS } from '../../constants/navigators'

type FollowerFollowingRouteProp = RouteProp<
  RootStackParamList,
  'FollowersFollowing'
>

interface Props {
  route: FollowerFollowingRouteProp
  navigation: any
  followers: Array<any>
  followings: Array<any>
  resetDefault: () => void
  getFollowersByUser: (userId: string) => void
  getFollowingsByUser: (userId: string) => void
  followUser: (userId: string) => void
  authUser: UserType
}

interface State {
  selectedTab: STATISTIC_INFO_NAME
  profileId: string
  profileName: string
  followerCount: number
  followingCount: number
  followedUsers: any
}

class FollowerFollowing extends React.Component<Props, State> {
  static defaultProps = {
    followers: [],
    followings: [],
    followedUsers: {},
  }

  constructor(props: Props) {
    super(props)

    const {
      route: { params },
    } = props

    this.state = {
      selectedTab: params.tabState,
      profileId: params.profileId || '',
      profileName: params.profileName,
      followerCount: params.followersCount,
      followingCount: params.followingsCount,
      followedUsers: params.followedUsers,
    }
  }

  componentWillUnmount() {
    const { resetDefault } = this.props
    resetDefault && resetDefault()
  }

  componentDidMount() {
    const { selectedTab, profileId } = this.state
    const { getFollowersByUser, getFollowingsByUser } = this.props

    switch (selectedTab) {
      case STATISTIC_INFO_NAME.FOLLOWERS:
        getFollowersByUser && getFollowersByUser(profileId)
        break

      case STATISTIC_INFO_NAME.FOLLOWING:
        getFollowingsByUser && getFollowingsByUser(profileId)
        break

      default:
        break
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (isEmpty(prevProps.followers) && !isEmpty(this.props.followers)) {
      this.setState({ followerCount: this.props.followers.length })
    } else if (
      isEmpty(prevProps.followings) &&
      !isEmpty(this.props.followings)
    ) {
      this.setState({ followingCount: this.props.followings.length })
    }
  }

  handleSelectTab = (tabState: STATISTIC_INFO_NAME) => {
    const { profileId } = this.state
    const { getFollowingsByUser, getFollowersByUser } = this.props

    if (tabState === STATISTIC_INFO_NAME.FOLLOWERS) {
      getFollowersByUser && getFollowersByUser(profileId)
    } else if (tabState === STATISTIC_INFO_NAME.FOLLOWING) {
      getFollowingsByUser && getFollowingsByUser(profileId)
    }

    this.setState({ selectedTab: tabState })
  }

  renderTab = (tabState: STATISTIC_INFO_NAME, tabCount: number) => {
    let tabStyles: Array<any> = [styles.tabView]
    let tabNameStyles: Array<any> = [styles.tabName]

    const { selectedTab } = this.state
    if (selectedTab === tabState) {
      tabStyles.push(styles.selectedTab)
      tabNameStyles.push(styles.selectedTabName)
    }

    return (
      <TouchableOpacity
        style={tabStyles}
        onPress={() => this.handleSelectTab(tabState)}>
        <Text style={tabNameStyles}>
          {tabCount} {tabEnumNames[tabState]}
        </Text>
      </TouchableOpacity>
    )
  }

  keyExtractor = (item: UserType) => {
    const { selectedTab } = this.state
    return `${selectedTab}__${item.id}`
  }

  handleAvatarAndUserNamePress = (id: string) => () => {
    const { authUser } = this.props

    if (authUser._id === id) {
      this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
    } else {
      this.props.navigation.push(NAVIGATORS.USER_PROFILE.name, {
        userId: id,
      })
    }
  }

  onPressFollowUser = (userId: string) => () => {
    this.setState(
      update(this.state, {
        followedUsers: {
          [userId]: { $set: 1 },
        },
      }),
    )

    const { followUser } = this.props
    followUser && followUser(userId)
  }

  renderListItem = ({ item }: { item: UserType }) => {
    const localization = localizedStrings.followerFollowing
    const { selectedTab, followedUsers } = this.state
    const followedUser = get(followedUsers, item.id, 0) > 0
    const navigateToUserProfile = this.handleAvatarAndUserNamePress(item.id)
    const pressFollowUser = this.onPressFollowUser(item.id)

    return (
      <View style={styles.listItemWrapper}>
        <TouchableOpacity onPress={navigateToUserProfile}>
          <UserAvatar
            imgSrc={item.avatar}
            heightOrWidth={40}
            isBusiness={item.accountType === ACCOUNT_TYPE.BUSINESS}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemName}
          onPress={navigateToUserProfile}>
          <Text>{item.name}</Text>
        </TouchableOpacity>

        {selectedTab === STATISTIC_INFO_NAME.FOLLOWERS && (
          <DefaultButton
            contentContainerStyle={styles.itemAction}
            text={localization.followButton}
            onPress={pressFollowUser}
            isDisabled={followedUser}
          />
        )}
      </View>
    )
  }

  render() {
    const { followerCount, followingCount, selectedTab } = this.state
    const { followers, followings } = this.props

    let dataList = []
    if (selectedTab === STATISTIC_INFO_NAME.FOLLOWERS) {
      dataList = followers
    } else {
      dataList = followings
    }

    return (
      <View style={styles.container}>
        <View style={styles.tabHeader}>
          {this.renderTab(STATISTIC_INFO_NAME.FOLLOWERS, followerCount)}

          {this.renderTab(STATISTIC_INFO_NAME.FOLLOWING, followingCount)}
        </View>

        <FlatList
          style={[styles.listContainer]}
          key={selectedTab}
          data={dataList}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderListItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
  },
  tabHeader: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 48,
  },
  tabView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.silver,
  },
  selectedTab: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
  },
  selectedTabName: {
    color: COLORS.black,
  },
  listContainer: {
    flex: 1,
  },
  listItemWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
  },
  itemAction: {
    maxHeight: 26,
  },
})

type TabEnumNamesType = {
  [key in string]: string
}

const tabEnumNames: TabEnumNamesType = {
  [STATISTIC_INFO_NAME.FOLLOWERS]: 'Followers',
  [STATISTIC_INFO_NAME.FOLLOWING]: 'Following',
}

export default FollowerFollowing

import React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { get, round, isEmpty } from 'lodash'
import { ACCOUNT_TYPE } from 'types'
import { UserType, TopProfileUserType } from '../../types/User.types'
import { DEFAULT_RECOMMEND_TOP_PROFILES_PER_PAGE } from 'constants'
import COLORS from '../../constants/colors'
import { FONT_FAMILIES } from '../../constants/fonts'
import { NAVIGATORS } from '../../constants/navigators'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'

interface Props {
  route: any
  navigation: any
  authUser: UserType
  profiles: Array<TopProfileUserType | any>
  loading: boolean
  pagination: any
  getTopProfiles: (profileType: string, skip?: number) => void
}

interface State {
  profileType: string
}

class TopProfiles extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const profileType = get(
      props,
      'route.params.profileType',
      ACCOUNT_TYPE.PERSONAL,
    )

    this.state = {
      profileType,
    }
  }

  componentDidMount() {
    const { getTopProfiles } = this.props
    const { profileType } = this.state
    getTopProfiles && getTopProfiles(profileType, 0)
  }

  handleAvatarAndUserNamePress = (id: string) => () => {
    const { authUser } = this.props

    if (authUser._id === id) {
      this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
    } else {
      this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
        userId: id,
      })
    }
  }

  renderStarIcon = (repeat: number = 1) => {
    let stars = []

    for (let i = 0; i < repeat; i++) {
      stars.push(
        <Icon
          type={IconType.Ionicons}
          name={'ios-star'}
          color={COLORS.goldenTainoi}
          size={15}
        />,
      )
    }

    return stars
  }

  calculateProfileRatingAvg = (profile: TopProfileUserType) => {
    let {
      totalReviewsPoint = 0,
      totalReviewsCount = 0,
      totalRatedPostPoint = 0,
      totalRatedPostCount = 0,
    } = profile

    if (totalRatedPostCount > 0) {
      totalReviewsPoint += totalRatedPostPoint
      totalReviewsCount += totalRatedPostCount
    }

    return totalReviewsCount === 0
      ? 0
      : round(totalReviewsPoint / totalReviewsCount, 1)
  }

  renderProfileItem = ({ item }: { item: TopProfileUserType }) => {
    if (isEmpty(item)) {
      return <View />
    }

    const navigateToUserProfile = this.handleAvatarAndUserNamePress(item._id)
    const ratingAvg = this.calculateProfileRatingAvg(item)
    const totalStar = round(ratingAvg, 0)

    return (
      <View style={styles.followTopItemWrapper} key={item._id}>
        <TouchableOpacity onPress={navigateToUserProfile}>
          <Image
            source={{ uri: item.avatar }}
            style={[styles.followTopItemAvatar]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.followTopItemName}
          onPress={navigateToUserProfile}>
          <Text>{item.name}</Text>
        </TouchableOpacity>

        <View style={styles.ratingButton}>
          <View style={styles.ratingContainer}>
            {this.renderStarIcon(totalStar)}

            <Text style={styles.bottomButtonText}>{round(ratingAvg, 1)}</Text>
          </View>
        </View>
      </View>
    )
  }

  onTopProfilesListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getTopProfiles,
      loading,
    } = this.props

    if (loading || endReached) {
      return
    }

    const { profileType } = this.state
    getTopProfiles &&
      getTopProfiles(
        profileType,
        skip + DEFAULT_RECOMMEND_TOP_PROFILES_PER_PAGE,
      )
  }

  render() {
    const { profiles } = this.props

    if (!isEmpty(profiles) && profiles.length % 2 !== 0) {
      profiles.push({})
    }

    return (
      <FlatList
        style={[styles.followTopListContainer]}
        data={profiles}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={this.renderProfileItem}
        onEndReachedThreshold={0.7}
        onEndReached={this.onTopProfilesListEndReached}
      />
    )
  }
}

const styles = StyleSheet.create({
  followTopContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
  },
  followTopHeaderWrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  followTopHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkBlue,
  },
  followTopSeeAllButton: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkBlue,
  },

  followTopListContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  followTopItemWrapper: {
    flex: 1,
    margin: 10,
    width: 140,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: COLORS.lightGray,
  },
  followTopItemAvatar: {
    width: 130,
    height: 130,
    overflow: 'hidden',
    borderRadius: 6,
    resizeMode: 'cover',
  },
  followTopItemName: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    marginVertical: 10,
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
})

export default TopProfiles

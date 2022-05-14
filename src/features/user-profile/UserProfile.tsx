import React from 'react'
import {
  Dimensions,
  FlatList,
  GestureResponderEvent,
  InteractionManager,
  Linking,
  Modal,
  PixelRatio,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { get, head, isEmpty, reduce, round } from 'lodash'

import localizedStrings from 'localization'
import UserAvatar from 'components/UserAvatar'
import COLORS from 'constants/colors'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import { DefaultButton } from 'components/DefaultButton'
import StatisticInfo from 'components/StatisticInfo'
import PostThumbnail from 'components/PostThumbnail'
import { Post } from 'types/Post.types'
import PostItem from '../home/components/PostItem/PostItem'
import { makeProfileOptions } from './navigation'
import {
  androidPackageName,
  DEFAULT_GRID_ITEMS_PER_PAGE,
  dynamicLinkPrefix,
  webAppDynamicPrefix,
  iOSBundleId,
  NAVIGATE_FROM_SOURCE,
  SOCIAL_LINK_TYPE,
  STATISTIC_INFO_NAME,
} from 'constants'
import { NAVIGATORS } from '../../constants/navigators'
import { OutlineButton } from 'components/OutlineButton'
import { ACCOUNT_TYPE, ATTACHMENT_TYPE, BottomActionSheetAction } from 'types'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../../navigators/RootStackParamList'
import { FONT_FAMILIES } from '../../constants/fonts'
import InfoModal from '../../components/InfoModal'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import { makeFacebookSchemeFromId } from '../../utils/deeplinkings'
import { BottomActionSheet } from '../../components/bottom-action-sheet'
import SharePostModal from 'components/SharePostModal'
import { AirbnbRating } from 'react-native-elements'
import moment from 'moment'
import { UserType } from 'types/User.types'

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>

interface Props {
  navigation: any
  route: UserProfileRouteProp
  loading: boolean
  pagination: any
  posts: Array<Post>
  userInfo: UserType
  followingsCount: number
  followersCount: number
  postsCount: number
  reviewsCount: number
  ratingTotalPoints: number
  ratingTotalPosts: number
  ratePost: (id: string, rating: number) => void
  getProfile: (userId?: string) => void
  getPosts: (id: string, skip: number, limit: number) => void
  likePost: (id: string) => void
  dislikePost: (id: string) => void
  currentUser: any
  followUser: (userId: string) => void
  getAuthProfile: () => void
  userInfoFollowings: Array<string>
  sharePost: (id: string, text: string) => void
  shareExternalPost: (id: string | null) => void
  getRatingPosts: (userId: string) => void
  categoriesById: { [key: string]: any }
}

interface State {
  showRatingModal: boolean
  tabIndexSelected: number
  postPerPage: number
  showWarningOpenDeeplink: boolean
  selectedSocialLinkType: SOCIAL_LINK_TYPE
  showBottomActionSheet: boolean
  isShareExternal: boolean
  showShareModal: boolean
}

const { width: screenWidth } = Dimensions.get('screen')
const thumbnailPostWidth = screenWidth / 2

class UserProfile extends React.Component<Props, State> {
  state = {
    showRatingModal: false,
    tabIndexSelected: 2,
    postPerPage: DEFAULT_GRID_ITEMS_PER_PAGE,
    showWarningOpenDeeplink: false,
    selectedSocialLinkType: SOCIAL_LINK_TYPE.WEBSITE,
    showBottomActionSheet: false,
    isShareExternal: false,
    showShareModal: false,
  }

  private sharedPostBottomActionSheetActions: BottomActionSheetAction[]
  private selectedItemId: string | null
  private selectedItemPost: Post | null

  constructor(props: Props) {
    super(props)

    this.sharedPostBottomActionSheetActions = [
      {
        renderIcon: () => (
          <Icon
            type={IconType.MaterialCommunityIcons}
            name={'share'}
            color={COLORS.cornFlowerBlue}
            size={25}
          />
        ),
        text: localizedStrings.home.shareInternal,
        onPress: this.sharePostInternal,
      },
      {
        renderIcon: () => (
          <Icon
            type={IconType.MaterialIcons}
            name={'share'}
            color={COLORS.cornFlowerBlue}
            size={25}
          />
        ),
        text: localizedStrings.home.shareExternal,
        onPress: this.sharePostExternal,
      },
      {
        renderIcon: () => (
          <Icon
            type={IconType.MaterialIcons}
            name={'chat'}
            color={COLORS.cornFlowerBlue}
            size={25}
          />
        ),
        text: localizedStrings.home.shareToChat,
        onPress: this.showChatPickerForShare,
      },
    ]

    this.selectedItemId = null
    this.selectedItemPost = null
  }

  unsubscribe: () => void = () => {}

  onClickShareButton = async () => {
    const { userInfo } = this.props
    const avatar = get(userInfo, 'avatar') || ''
    const name = get(userInfo, 'name') || ''
    const location = get(userInfo, 'location') || ''
    const ratingAvg = round(get(userInfo, 'ratingAvg') || 5) || '5.0'
    const description = get(userInfo, 'description', '')
    const locationText = isEmpty(location) ? '' : `${location} |`

    try {
      const userId = get(this.props.route, 'params.userId', '')
      const link = await dynamicLinks().buildShortLink(
        {
          link: encodeURI(`${webAppDynamicPrefix}/profile?userId=${userId}`),
          // domainUriPrefix is created in your Firebase console
          domainUriPrefix: dynamicLinkPrefix,
          // optional set up which updates Firebase analytics campaign
          // "banner". This also needs setting up before hand
          android: {
            packageName: androidPackageName,
          },
          ios: {
            bundleId: iOSBundleId,
          },
          social: {
            title: name,
            descriptionText: `${locationText} Rating: ${ratingAvg} |
            ${description}`,
            imageUrl: avatar,
          },
        },
        dynamicLinks.ShortLinkType.UNGUESSABLE,
      )

      const result = await Share.share({
        message: `${link}`,
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // console.log('Activity Type', result.activityType)
        } else {
          // console.log('Shared')
        }
      } else if (result.action === Share.dismissedAction) {
        // console.log('Dismissed')
      }
    } catch (error) {
      // console.log(error.message)
    }
  }

  componentDidMount() {
    const {
      navigation,
      getProfile,
      getRatingPosts,
      getPosts,
      route,
      getAuthProfile,
    } = this.props

    navigation.setOptions(makeProfileOptions(this.onClickShareButton))
    const userId = get(route, 'params.userId', '')
    const navigateFromSource = get(route, 'params.source', '')

    if (
      !isEmpty(navigateFromSource) &&
      navigateFromSource === NAVIGATE_FROM_SOURCE.DIRECTORIES_RESULT
    ) {
      this.setState({ tabIndexSelected: 0 })
    }

    if (!isEmpty(userId)) {
      getProfile && getProfile(userId)
      getAuthProfile && getAuthProfile()
      const { postPerPage } = this.state
      getPosts && getPosts(userId, 0, postPerPage)
    }
  }

  onClickFollowButton = () => {
    const { route, followUser } = this.props
    const userId = get(route, 'params.userId', '')
    followUser(userId)
  }

  onClickMessageButton = () => {
    const { route, navigation } = this.props
    const userId = get(route, 'params.userId', '')
    navigation.navigate(NAVIGATORS.CHAT_ROOM.name, { userId })
  }

  onClickPressInfo = (state: STATISTIC_INFO_NAME) => {
    const {
      userInfo,
      followersCount,
      followingsCount,
      currentUser,
      userInfoFollowings,
    } = this.props

    let followedUsers = reduce(
      userInfoFollowings,
      (result: any, id: string) => {
        result[id] = 1
        return result
      },
      {},
    )
    followedUsers[currentUser._id] = 1

    this.props.navigation.navigate(NAVIGATORS.FOLLOWERS_FOLLOWING.name, {
      profileId: userInfo._id,
      profileName: userInfo.name,
      tabState: state,
      followingsCount: followingsCount,
      followersCount: followersCount,
      followedUsers,
    })
  }

  onClickReviewsInfo = () => {
    const { userInfo, currentUser } = this.props

    this.props.navigation.push(NAVIGATORS.REVIEWS.name, {
      userId: currentUser._id,
      targetId: userInfo._id,
    })
  }

  switchViewSelected = (index: number) => {
    this.setState({
      tabIndexSelected: index,
    })
  }

  onCloseWarningSocialDeeplink = () => {
    this.setState({
      selectedSocialLinkType: SOCIAL_LINK_TYPE.WEBSITE,
      showWarningOpenDeeplink: false,
    })
  }

  handleOpenLink = async (
    socialLinkType: SOCIAL_LINK_TYPE,
    idOrURL: string,
  ) => {
    switch (socialLinkType) {
      case SOCIAL_LINK_TYPE.FACEBOOK:
        return await Linking.openURL(makeFacebookSchemeFromId(idOrURL))

      case SOCIAL_LINK_TYPE.TWITTER:
        return await Linking.openURL(`twitter://user?screen_name=${idOrURL}`)

      case SOCIAL_LINK_TYPE.INSTAGRAM:
        return await Linking.openURL(`instagram://user?username=${idOrURL}`)

      case SOCIAL_LINK_TYPE.YOUTUBE:
        return await Linking.openURL(`vnd.youtube:///channel/${idOrURL}`)

      case SOCIAL_LINK_TYPE.EMAIL:
        return await Linking.openURL(`mailto:${idOrURL}`)

      case SOCIAL_LINK_TYPE.LINKED_IN:
        return await Linking.openURL(`https://www.linkedin.com/in/${idOrURL}`)

      default:
        if (idOrURL.startsWith('http') || idOrURL.startsWith('https')) {
          return await Linking.openURL(idOrURL)
        }

        return await Linking.openURL(`http://${idOrURL}`)
    }
  }

  handleWarningOpenLinkFailure = () => {
    const deepLinkErr = localizedStrings.commonErrors.deepLink
    const { selectedSocialLinkType } = this.state

    switch (selectedSocialLinkType) {
      case SOCIAL_LINK_TYPE.FACEBOOK:
        return deepLinkErr.facebook

      case SOCIAL_LINK_TYPE.TWITTER:
        return deepLinkErr.twitter

      case SOCIAL_LINK_TYPE.INSTAGRAM:
        return deepLinkErr.instagram

      case SOCIAL_LINK_TYPE.YOUTUBE:
        return deepLinkErr.youtube

      default:
        return deepLinkErr.web
    }
  }

  openFacebookLink = async () => {
    try {
      const {
        userInfo: { facebookUserId = '' },
      } = this.props
      await this.handleOpenLink(SOCIAL_LINK_TYPE.FACEBOOK, facebookUserId)
    } catch (error) {
      this.setState({
        showWarningOpenDeeplink: true,
        selectedSocialLinkType: SOCIAL_LINK_TYPE.FACEBOOK,
      })
    }
  }

  openTwitterLink = async () => {
    try {
      const {
        userInfo: { twitterUserId = '' },
      } = this.props
      await this.handleOpenLink(SOCIAL_LINK_TYPE.TWITTER, twitterUserId)
    } catch (error) {
      this.setState({
        showWarningOpenDeeplink: true,
        selectedSocialLinkType: SOCIAL_LINK_TYPE.TWITTER,
      })
    }
  }

  openYoutubeChannel = async () => {
    try {
      const {
        userInfo: { youtubeUserId = '' },
      } = this.props
      await this.handleOpenLink(SOCIAL_LINK_TYPE.YOUTUBE, youtubeUserId)
    } catch (error) {
      this.setState({
        showWarningOpenDeeplink: true,
        selectedSocialLinkType: SOCIAL_LINK_TYPE.YOUTUBE,
      })
    }
  }

  openInstagramLink = async () => {
    try {
      const {
        userInfo: { instagramUserId = '' },
      } = this.props
      await this.handleOpenLink(SOCIAL_LINK_TYPE.INSTAGRAM, instagramUserId)
    } catch (error) {
      this.setState({
        showWarningOpenDeeplink: true,
        selectedSocialLinkType: SOCIAL_LINK_TYPE.INSTAGRAM,
      })
    }
  }

  openWebAddress = async () => {
    try {
      const {
        userInfo: { website = '' },
      } = this.props
      await this.handleOpenLink(SOCIAL_LINK_TYPE.WEBSITE, website)
    } catch (error) {
      this.setState({
        showWarningOpenDeeplink: true,
        selectedSocialLinkType: SOCIAL_LINK_TYPE.WEBSITE,
      })
    }
  }

  openLinkedIn = async () => {
    try {
      const {
        userInfo: { linkedInId = '' },
      } = this.props
      await this.handleOpenLink(SOCIAL_LINK_TYPE.LINKED_IN, linkedInId)
    } catch (error) {
      this.setState({
        showWarningOpenDeeplink: true,
        selectedSocialLinkType: SOCIAL_LINK_TYPE.LINKED_IN,
      })
    }
  }

  openComposeEmail = async () => {
    try {
      const {
        userInfo: { email = '' },
      } = this.props
      await this.handleOpenLink(SOCIAL_LINK_TYPE.EMAIL, email)
    } catch (error) {
      this.setState({
        showWarningOpenDeeplink: true,
        selectedSocialLinkType: SOCIAL_LINK_TYPE.EMAIL,
      })
    }
  }

  renderUserInfoSection = () => {
    const localization = localizedStrings.profile
    const {
      userInfo,
      followingsCount,
      followersCount,
      postsCount,
      reviewsCount,
      currentUser,
    } = this.props

    const ratingAvg = get(userInfo, 'ratingAvg', 0)
    const location = get(userInfo, 'location', '')
    const description = get(userInfo, 'description', '')
    const isBusiness = userInfo.accountType === ACCOUNT_TYPE.BUSINESS
    const followings = get(currentUser, 'followings', [])
    const followed = followings.includes(userInfo._id)
    const followButtonText = followed
      ? localization.unFollowButton
      : localization.followButton

    return (
      <View style={styles.userInfoSection}>
        <UserAvatar
          imgSrc={userInfo.avatar}
          heightOrWidth={120}
          isBusiness={isBusiness}
        />

        <Text style={styles.fullName}>{get(userInfo, 'name', '')}</Text>

        <View style={styles.ratingContainer}>
          <Icon
            type={IconType.AntDesign}
            name={'star'}
            color={COLORS.darkYellow}
            size={10}
          />

          <Text style={styles.rating}>{round(ratingAvg, 2)}</Text>
        </View>

        {!isEmpty(location) && <Text style={styles.location}>{location}</Text>}

        {!isEmpty(description) && (
          <Text style={styles.description}>{description}</Text>
        )}

        <View style={styles.actionSection}>
          <OutlineButton
            style={styles.followButton}
            text={followButtonText}
            onPress={this.onClickFollowButton}
          />

          <View style={styles.gapBetween} />

          <DefaultButton
            style={styles.messageButton}
            text={localization.messageButton}
            onPress={this.onClickMessageButton}
          />
        </View>

        <View style={styles.socialNetworksContainer}>
          {isBusiness && (
            <>
              <TouchableOpacity
                style={styles.socialNetworkButton}
                onPress={this.openFacebookLink}>
                <Icon
                  type={IconType.FontAwesome}
                  name={'facebook'}
                  color={COLORS.facebook}
                  size={17}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialNetworkButton}
                onPress={this.openTwitterLink}>
                <Icon
                  type={IconType.FontAwesome}
                  name={'twitter'}
                  color={COLORS.twitter}
                  size={17}
                />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.socialNetworkButton}
            onPress={this.openWebAddress}>
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={'web'}
              color={COLORS.website}
              size={17}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialNetworkButton}
            onPress={this.openYoutubeChannel}>
            <Icon
              type={IconType.AntDesign}
              name={'youtube'}
              color={COLORS.red}
              size={17}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialNetworkButton}
            onPress={this.openInstagramLink}>
            <Icon
              type={IconType.AntDesign}
              name={'instagram'}
              color={COLORS.red}
              size={17}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialNetworkButton}
            onPress={this.openComposeEmail}>
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={'email-outline'}
              color={COLORS.red}
              size={17}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statisticSection}>
          <StatisticInfo
            style={styles.statisticItemSection}
            heading={localization.statistic.posts}
            content={postsCount}
            state={STATISTIC_INFO_NAME.POSTS}
          />

          <StatisticInfo
            style={styles.statisticItemSection}
            heading={localization.statistic.followers}
            content={followersCount}
            state={STATISTIC_INFO_NAME.FOLLOWERS}
            onPressInfo={this.onClickPressInfo}
          />

          <StatisticInfo
            style={styles.statisticItemSection}
            heading={localization.statistic.following}
            content={followingsCount}
            state={STATISTIC_INFO_NAME.FOLLOWING}
            onPressInfo={this.onClickPressInfo}
          />

          {isBusiness && (
            <StatisticInfo
              style={styles.statisticItemSection}
              heading={localization.statistic.reviews}
              content={reviewsCount}
              state={STATISTIC_INFO_NAME.REVIEWS}
              onPressInfo={this.onClickReviewsInfo}
            />
          )}
        </View>
      </View>
    )
  }

  renderSwitchViewSection = () => {
    const { tabIndexSelected } = this.state
    const { userInfo } = this.props
    const isBusiness = userInfo.accountType === ACCOUNT_TYPE.BUSINESS

    return (
      <View style={styles.switchViewSection}>
        <TouchableOpacity
          style={styles.settingsButton}
          disabled={tabIndexSelected === 2}
          onPress={() => {
            this.switchViewSelected(2)
          }}>
          <Icon
            type={IconType.MaterialCommunityIcons}
            name={'view-grid'}
            color={tabIndexSelected === 2 ? COLORS.easternBlue : COLORS.silver}
            size={28}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          disabled={tabIndexSelected === 1}
          onPress={() => {
            this.switchViewSelected(1)
          }}>
          <Icon
            type={IconType.FontAwesome5}
            name={'list'}
            color={
              tabIndexSelected === 1 || (tabIndexSelected === 0 && !isBusiness)
                ? COLORS.easternBlue
                : COLORS.silver
            }
            size={22}
          />
        </TouchableOpacity>

        {isBusiness && (
          <TouchableOpacity
            style={styles.settingsButton}
            disabled={tabIndexSelected === 0}
            onPress={() => {
              this.switchViewSelected(0)
            }}>
            <Icon
              type={IconType.Foundation}
              name={'info'}
              color={
                tabIndexSelected === 0 ? COLORS.easternBlue : COLORS.silver
              }
              size={28}
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  onItemRatingButtonPress = (id: string) => {
    this.selectedItemId = id
    this.setState({
      showRatingModal: true,
    })
  }

  onItemLikesButtonPress = (id: string) => {
    this.props.likePost(id)
  }

  onItemDislikesButtonPress = (id: string) => {
    this.props.dislikePost(id)
  }

  onCommentsButtonPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
  }

  renderPostListItem = ({ item }: { item: Post }) => {
    const { userInfo } = this.props

    return (
      <PostItem
        data={item}
        onPressViewMore={() => {}}
        onRatingButtonPress={this.onItemRatingButtonPress}
        onLikesButtonPress={this.onItemLikesButtonPress}
        onDislikesButtonPress={this.onItemDislikesButtonPress}
        onCommentsButtonPress={this.onCommentsButtonPress}
        onAvatarAndUserNamePress={() => {}}
        currentUserId={userInfo._id}
        onShareButtonPress={this.onShareButtonPress}
      />
    )
  }

  onPostThumbnailPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
  }

  onRatingModalPressOutside = (e: GestureResponderEvent) => {
    this.selectedItemId = null
    this.selectedItemPost = null

    this.setState({
      showRatingModal: false,
    })
    return true
  }

  onFinishRating = (rating: number) => {
    this.props.ratePost(this.selectedItemId || '', rating)

    setTimeout(() => {
      this.setState({
        showRatingModal: false,
      })
      this.selectedItemId = null
      this.selectedItemPost = null
    }, 500)
  }

  renderInfoItem = () => {
    const { userInfo, categoriesById } = this.props

    const categoryId = get(userInfo, 'subCategory.categoryId', '')
    const categoryName = get(categoriesById, `${categoryId}.name`, '')
    const yearFoundedLong = get(userInfo, 'yearFounded.timeStamp', 0)
    const location = get(userInfo, 'location', '')

    const finalLocation = !isEmpty(location)
      ? location
      : get(userInfo, 'addressOne', '') +
        ' ' +
        get(userInfo, 'addressTwo', '') +
        ' ' +
        get(userInfo, 'city', '') +
        ' ' +
        get(userInfo, 'state', '') +
        ' ' +
        get(userInfo, 'zipCode', '')
    const workingHours: any = get(userInfo, 'workingHours', [])
    const tagCodes: any = get(userInfo, 'tagCodes', [])

    return (
      <View>
        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.userInfoChild,
              styles.userInfoFirst,
              styles.userInfoTagFirst,
            ]}>
            {localizedStrings.editProfile.aboutCEO}
          </Text>
          <Text style={[styles.userInfoChild, styles.userInfoSecond]}>
            {get(userInfo, 'aboutCEO', '')}
          </Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.userInfoChild,
              styles.userInfoFirst,
              styles.userInfoTagFirst,
            ]}>
            {localizedStrings.editProfile.linkedIn}
          </Text>

          <TouchableOpacity
            style={[styles.userInfoSecond]}
            onPress={this.openLinkedIn}>
            <Text style={[styles.userInfoChild, styles.userInfoLinkedIn]}>
              {get(userInfo, 'linkedInId', '')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.userInfoChild,
              styles.userInfoFirst,
              styles.userInfoTagFirst,
            ]}>
            {localizedStrings.editProfile.category}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.userInfoChild, styles.userInfoSecond]}>
            {categoryName}
          </Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.userInfoChild,
              styles.userInfoFirst,
              styles.userInfoTagFirst,
            ]}>
            {localizedStrings.editProfile.founded}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.userInfoChild, styles.userInfoSecond]}>
            {moment(new Date(yearFoundedLong)).format('YYYY')}
          </Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.userInfoChild,
              styles.userInfoFirst,
              styles.userInfoTagFirst,
            ]}>
            {localizedStrings.editProfile.location}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.userInfoChild, styles.userInfoSecond]}>
            {finalLocation}
          </Text>
        </View>

        {workingHours.map((workingHour: any, index: number) => {
          return (
            <View style={styles.userInfoContainer}>
              <Text style={[styles.userInfoChild, styles.userInfoFirst]}>
                {index === 0 ? localizedStrings.editProfile.openingHours : ''}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.userInfoChild,
                  styles.userWorkingHourInfoSecond,
                ]}>
                {workingHour.dayOfWeek}
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.userInfoChild, styles.userWorkingHourInfoThird]}>
                {workingHour.opening + '-' + workingHour.closing}
              </Text>
            </View>
          )
        })}

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.userInfoChild,
              styles.userInfoFirst,
              styles.userInfoTagFirst,
            ]}>
            {localizedStrings.editProfile.phoneShort}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.userInfoChild, styles.userInfoSecond]}>
            {get(userInfo, 'phoneNumber', '')}
          </Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text
            style={[
              styles.userInfoChild,
              styles.userInfoFirst,
              styles.userInfoTagFirst,
            ]}>
            {localizedStrings.editProfile.tags}
          </Text>
          <View style={styles.tagViewParent}>
            {tagCodes.map((tagCode: string) => {
              return (
                <View key={tagCode} style={styles.tagViewChild}>
                  <Text numberOfLines={1} style={styles.text}>
                    {tagCode}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }

  renderPostGridItem = ({ item }: { item: Post }) => {
    const originalPost = isEmpty(item.sharedFrom) ? item : item.sharedFrom
    const { attachments } = originalPost

    const attachment = head(attachments)
    const itemType = get(attachment, 'type', '')
    if (isEmpty(itemType)) {
      return null
    }

    const imgUrl =
      itemType === ATTACHMENT_TYPE.PHOTO
        ? get(attachment, 'url', '')
        : get(attachment, 'previewUrl', '')

    return (
      <PostThumbnail
        imgUrl={imgUrl}
        type={itemType}
        width={thumbnailPostWidth}
        onPress={() => this.onPostThumbnailPress(item.id)}
      />
    )
  }

  publishExternalPost = async (postId: string | null, post: Post | null) => {
    try {
      const postType = get(post, 'attachments[0].type', '')

      const social = {
        title: get(post, 'text', ''),
        descriptionText: get(post, 'author.name', ''),
        imageUrl:
          postType === 'video'
            ? get(post, 'attachments[0].previewUrl', '')
            : get(post, 'attachments[0].url', ''),
      }

      const link = await dynamicLinks().buildShortLink(
        {
          link: encodeURI(`${webAppDynamicPrefix}/post?postId=${postId}`),
          // domainUriPrefix is created in your Firebase console
          domainUriPrefix: dynamicLinkPrefix,
          // optional set up which updates Firebase analytics campaign
          // "banner". This also needs setting up before hand
          android: {
            packageName: androidPackageName,
          },
          ios: {
            bundleId: iOSBundleId,
          },
          social,
        },
        dynamicLinks.ShortLinkType.UNGUESSABLE,
      )

      const result = await Share.share({
        message: `${link}`,
      })

      // console.log('Result', result)
      this.setState({
        showShareModal: false,
      })
      this.props.shareExternalPost(postId)

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // console.log('Activity Type', result.activityType)
        } else {
          // console.log('Shared')
        }
      } else if (result.action === Share.dismissedAction) {
        // console.log('Dismissed')
      }
    } catch (error) {
      // console.log(error.message)
    }
  }

  clearPostCache = () => {
    this.selectedItemId = null
    this.selectedItemPost = null
  }

  onShareButtonPress = (postId: string, post: any) => {
    if (!post) {
      return
    }

    this.selectedItemId = postId
    this.selectedItemPost = post

    this.setState({
      showBottomActionSheet: true,
    })
  }

  sharePostInternal = () => {
    this.setState({
      showBottomActionSheet: false,
      showShareModal: true,
      isShareExternal: false,
    })
  }

  sharePostExternal = () => {
    this.setState(
      {
        showBottomActionSheet: false,
        showShareModal: false,
        isShareExternal: true,
      },
      () => {
        this.publishExternalPost(
          this.selectedItemId,
          this.selectedItemPost,
        ).then(() => {
          this.clearPostCache()
        })
      },
    )
  }

  showChatPickerForShare = () => {
    const { navigation } = this.props
    this.setState({
      showBottomActionSheet: false,
      showShareModal: false,
    })
    navigation.navigate(NAVIGATORS.CHAT_PICKER.name, { from: NAVIGATORS.HOME })
  }

  onShareConfirm = (text: string) => {
    this.setState(
      {
        showShareModal: false,
      },
      () => {
        const task = InteractionManager.runAfterInteractions(() => {
          if (typeof this.selectedItemId === 'string') {
            const { sharePost } = this.props
            sharePost(this.selectedItemId, text)
          }
        })

        task.then(this.clearPostCache, this.clearPostCache)
      },
    )
  }

  onShareModalOverlayPress = () => {
    this.setState({
      showShareModal: false,
    })
  }

  onBottomActionSheetOverlayPress = () => {
    this.setState({
      showBottomActionSheet: false,
    })
  }

  onListEndReached = () => {
    const { postPerPage } = this.state
    const {
      pagination: { skip, endReached },
      getPosts,
      loading,
      route,
    } = this.props

    if (!getPosts || loading || endReached) {
      return
    }

    const userId = get(route, 'params.userId', '')
    getPosts(userId, skip + postPerPage, postPerPage)
  }

  keyExtractor = (item: Post) => {
    const { tabIndexSelected } = this.state
    let tabStr: string
    switch (tabIndexSelected) {
      case 1:
        tabStr = 'list'
        break
      case 2:
        tabStr = 'grid'
        break
      default:
        tabStr = 'info'
        break
    }
    return `${item.id}-${tabStr}`
  }

  renderItemSeparator = () => {
    return <View style={styles.separatorView} />
  }

  render() {
    const { posts, userInfo } = this.props
    const {
      showRatingModal,
      tabIndexSelected,
      showWarningOpenDeeplink,
      showBottomActionSheet,
      showShareModal,
    } = this.state
    const { commonErrors } = localizedStrings
    const failureOpenLinkMessage = this.handleWarningOpenLinkFailure()
    const isBusiness = userInfo.accountType === ACCOUNT_TYPE.BUSINESS
    let totalColumns = 1
    let filteredPosts: any
    let listStyles: Array<any> = [styles.postsSection]
    let headerStyles: Array<any> = [styles.headerListSection]
    let renderFunc: any
    const preTaskFunc = () => {
      filteredPosts = posts
      renderFunc = {
        renderItem: this.renderPostListItem,
        ItemSeparatorComponent: this.renderItemSeparator,
      }
    }

    switch (tabIndexSelected) {
      case 1:
        preTaskFunc()
        break
      case 2:
        totalColumns = 2
        listStyles.push(styles.postsSectionGrid)
        headerStyles.push(styles.headerGridSection)
        renderFunc = {
          renderItem: this.renderPostGridItem,
          ItemSeparatorComponent: undefined,
        }

        filteredPosts = posts.filter((post: Post) => {
          const { attachments } = post
          return !isEmpty(attachments)
        })
        break
      default:
        if (isBusiness) {
          filteredPosts = [{}]
          renderFunc = {
            renderItem: this.renderInfoItem,
            ItemSeparatorComponent: undefined,
          }
        } else {
          preTaskFunc()
        }
        break
    }

    return (
      <View style={styles.container}>
        <InfoModal
          visible={showWarningOpenDeeplink}
          title={commonErrors.deepLink.title}
          message={failureOpenLinkMessage}
          onOkButtonPress={this.onCloseWarningSocialDeeplink}
        />

        <FlatList
          style={listStyles}
          nestedScrollEnabled={true}
          keyExtractor={this.keyExtractor}
          data={filteredPosts}
          key={totalColumns}
          numColumns={totalColumns}
          onEndReached={this.onListEndReached}
          onEndReachedThreshold={0.7}
          ListHeaderComponent={() => (
            <View style={headerStyles}>
              {this.renderUserInfoSection()}

              <View style={styles.horizontalLine} />

              <View>{this.renderSwitchViewSection()}</View>
            </View>
          )}
          {...renderFunc}
        />

        <SharePostModal
          visible={showShareModal}
          onSharePress={this.onShareConfirm}
          transparent={true}
          onOverlayPress={this.onShareModalOverlayPress}
        />

        <Modal visible={showRatingModal} transparent={true}>
          <View
            style={styles.ratingModalContainer}
            onStartShouldSetResponder={this.onRatingModalPressOutside}>
            <View style={styles.ratingModalContent}>
              <AirbnbRating
                showRating={false}
                defaultRating={1}
                onFinishRating={this.onFinishRating}
              />
            </View>
          </View>
        </Modal>

        <BottomActionSheet
          isShowing={showBottomActionSheet}
          actions={this.sharedPostBottomActionSheetActions}
          onOverlayPress={this.onBottomActionSheetOverlayPress}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerListSection: {
    flex: 1,
  },
  headerGridSection: {
    marginLeft: -20,
  },
  userInfoSection: {
    flex: 1,
    alignItems: 'center',
    margin: 20,
  },
  fullName: {
    marginTop: 13,
    fontSize: 17,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  subInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: COLORS.midGray,
    fontSize: 12,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  description: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: COLORS.midGray,
    marginLeft: 4,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  actionSection: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  followButton: {
    flexBasis: '47%',
    borderColor: COLORS.oceanGreen,
    borderWidth: 2,
  },
  messageButton: {
    flexBasis: '47%',
  },
  gapBetween: {
    flexBasis: '6%',
  },
  settingsButton: {
    padding: 7,
    marginLeft: 10,
  },
  statisticSection: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  statisticItemSection: {
    flex: 1,
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.silver,
  },
  postsViewSection: {
    flex: 1,
  },
  switchViewSection: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 12,
    marginBottom: 12,
  },
  postsSection: {
    flex: 1,
    width: '100%',
  },
  postsSectionGrid: {
    paddingLeft: 20,
  },
  separatorView: {
    height: 1 / PixelRatio.get(),
    backgroundColor: COLORS.geyser,
    marginVertical: 15,
    marginHorizontal: 19,
  },
  socialNetworksContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  socialNetworkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 5,
    elevation: 2,
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
  userInfoContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
  },
  userInfoChild: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
    flex: 1,
    includeFontPadding: false,
    alignSelf: 'stretch',
    fontSize: 14,
  },
  userInfoFirst: {
    includeFontPadding: false,
    fontWeight: 'normal',
    marginStart: 4,
  },
  userInfoTagFirst: {
    marginTop: 8,
  },
  userInfoSecond: {
    flex: 2,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '700',
    fontSize: 15,
    includeFontPadding: false,
    marginBottom: 16,
  },
  userInfoLinkedIn: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '700',
    fontSize: 15,
    includeFontPadding: false,
    color: COLORS.oceanGreen,
    textDecorationLine: 'underline',
  },
  userWorkingHourInfoSecond: {
    flex: 1,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '700',
    fontSize: 15,
    marginStart: 40,
    includeFontPadding: false,
    marginBottom: 16,
  },
  userWorkingHourInfoThird: {
    flex: 2,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '700',
    fontSize: 15,
    includeFontPadding: false,
    marginBottom: 16,
  },
  tagViewParent: {
    marginStart: -12,
    marginBottom: 16,
    marginEnd: 4,
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagViewChild: {
    backgroundColor: COLORS.lightEasternBlue,
    height: 32,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: 8,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    color: COLORS.black,
    opacity: 0.7,
  },
})

export default UserProfile

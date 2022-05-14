import React from 'react'
import {
  Dimensions,
  FlatList,
  Linking,
  PixelRatio,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  InteractionManager,
  GestureResponderEvent,
  Modal,
} from 'react-native'
import { get, head, isEmpty, reduce, round } from 'lodash'
import Clipboard from '@react-native-clipboard/clipboard'
import localizedStrings from 'localization'
import UserAvatar from 'components/UserAvatar'
import COLORS from 'constants/colors'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import StatisticInfo from 'components/StatisticInfo'
import PostThumbnail from 'components/PostThumbnail'
import { Post } from 'types/Post.types'
import PostItem from '../home/components/PostItem/PostItem'
import { makeProfileOptions } from './navigation'
import {
  DEFAULT_GRID_ITEMS_PER_PAGE,
  SOCIAL_LINK_TYPE,
  STATISTIC_INFO_NAME,
  dynamicLinkPrefix,
  webAppDynamicPrefix,
  androidPackageName,
  iOSBundleId,
  NEW_POST_MODE,
} from 'constants/index'
import { NAVIGATORS } from '../../constants/navigators'
import { ACCOUNT_TYPE, ATTACHMENT_TYPE, BottomActionSheetAction } from 'types'
import { FONT_FAMILIES } from 'constants/fonts'
import InfoModal from '../../components/InfoModal'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import { makeFacebookSchemeFromId } from 'utils/deeplinkings'
import SharePostModal from '../../components/SharePostModal'
import { BottomActionSheet } from '../../components/bottom-action-sheet'
import { AirbnbRating } from 'react-native-elements'
import { UserType } from 'types/User.types'
import moment from 'moment'
import { color } from 'react-native-reanimated'

interface Props {
  navigation: any
  loading: boolean
  pagination: any
  posts: Array<Post>
  authUser: UserType
  currentUser: UserType
  followingsCount: number
  followersCount: number
  postsCount: number
  reviewsCount: number
  ratingTotalPoints: number
  ratingTotalPosts: number
  getProfile: () => void
  ratePost: (id: string, rating: number) => void
  getPosts: (id: string, skip: number, limit: number) => void
  likePost: (id: string) => void
  dislikePost: (id: string) => void
  clearEditProfile: () => void
  sharePost: (id: string | null, text: string) => void
  shareExternalPost: (id: string | null) => void
  getRatingPosts: (userId: string) => void
  deletePost: (postId: string) => void
  categoriesById: { [key: string]: any }
}

interface State {
  bottomActionSheetActions: BottomActionSheetAction[]
  showRatingModal: boolean
  showBottomActionSheet: boolean
  isShareExternal: boolean
  showShareModal: boolean
  tabIndexSelected: number
  postPerPage: number
  showWarningOpenDeeplink: boolean
  selectedSocialLinkType: SOCIAL_LINK_TYPE
}

const { width: screenWidth } = Dimensions.get('screen')
const thumbnailPostWidth = screenWidth / 2

class Profile extends React.Component<Props, State> {
  state = {
    showRatingModal: false,
    showBottomActionSheet: false,
    isShareExternal: false,
    showShareModal: false,
    tabIndexSelected: 2,
    postPerPage: DEFAULT_GRID_ITEMS_PER_PAGE,
    showWarningOpenDeeplink: false,
    selectedSocialLinkType: SOCIAL_LINK_TYPE.WEBSITE,
    bottomActionSheetActions: [],
  }

  private readonly sharedPostBottomActionSheetActions: BottomActionSheetAction[]
  private readonly ownedPostBottomActionSheetActions: BottomActionSheetAction[]

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

    this.ownedPostBottomActionSheetActions = [
      {
        renderIcon: () => (
          <Icon
            type={IconType.MaterialIcons}
            name={'edit'}
            color={COLORS.cornFlowerBlue}
            size={25}
          />
        ),
        text: localizedStrings.home.editPost,
        onPress: this.onEditPostPress,
      },
      {
        renderIcon: () => (
          <Icon
            type={IconType.MaterialIcons}
            name={'delete'}
            color={COLORS.coral}
            size={25}
          />
        ),
        text: localizedStrings.home.deletePost,
        onPress: this.onDeletePostPress,
      },
    ]

    this.selectedItemId = null
    this.selectedItemPost = null
  }

  unsubscribe: () => void = () => {}

  componentDidMount() {
    const { navigation, getProfile, getPosts, authUser, getRatingPosts } =
      this.props
    navigation.setOptions(
      makeProfileOptions(
        this.onClickSettingsButton,
        this.onClickEditButton,
        this.onClickShareButton,
      ),
    )

    this.unsubscribe = navigation.addListener('focus', () => {
      getProfile && getProfile()

      if (!isEmpty(authUser)) {
        const { postPerPage } = this.state
        getPosts && getPosts(authUser._id, 0, postPerPage)
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (isEmpty(prevProps.authUser) && !isEmpty(this.props.authUser)) {
      const { postPerPage } = this.state
      const { getPosts, authUser, getRatingPosts } = this.props
      getRatingPosts && getRatingPosts(authUser._id)
      getPosts && getPosts(authUser._id, 0, postPerPage)
    }
  }

  onEditPostPress = () => {
    const { posts } = this.props
    this.setState({
      showBottomActionSheet: false,
    })
    const post = posts.find((post) => post._id === this.selectedItemId)
    this.props.navigation.navigate(NAVIGATORS.EDIT_POST.name, {
      post,
      mode: NEW_POST_MODE.EDIT,
    })
    this.selectedItemId = null
    this.selectedItemPost = null
  }

  onDeletePostPress = () => {
    this.setState({
      showBottomActionSheet: false,
    })
    this.props.deletePost(this.selectedItemId || '')
    this.selectedItemId = null
    this.selectedItemPost = null
  }

  onClickEditButton = () => {
    const { navigation, authUser, clearEditProfile, categoriesById } =
      this.props

    clearEditProfile && clearEditProfile()
    navigation.navigate(NAVIGATORS.EDIT_PROFILE.name, {
      profile: authUser,
      allCategory: categoriesById,
    })
  }

  onClickSettingsButton = () => {
    this.props.navigation.navigate(NAVIGATORS.SETTINGS.name)
  }

  onClickShareButton = async () => {
    const { authUser } = this.props
    const avatar = get(authUser, 'avatar') || ''
    const name = get(authUser, 'name') || ''
    const location = get(authUser, 'location') || ''
    const ratingAvg = round(get(authUser, 'ratingAvg') || 5) || '5.0'
    const description = get(authUser, 'description', '')
    const locationText = isEmpty(location) ? '' : `${location} |`

    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: encodeURI(
            `${webAppDynamicPrefix}/profile?userId=${this.props.authUser._id}`,
          ),
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
      console.log(error.message)
    }
  }

  onCloseWarningSocialDeeplink = () => {
    this.setState({
      selectedSocialLinkType: SOCIAL_LINK_TYPE.WEBSITE,
      showWarningOpenDeeplink: false,
    })
  }

  onClickPressInfo = (state: STATISTIC_INFO_NAME) => {
    const { authUser, followingsCount, followersCount } = this.props
    const followedUserIds = get(authUser, 'followings', [])
    const followedUsers = reduce(
      followedUserIds,
      (result: any, id: string) => {
        result[id] = 1
        return result
      },
      {},
    )

    this.props.navigation.navigate(NAVIGATORS.FOLLOWERS_FOLLOWING.name, {
      profileId: authUser._id,
      profileName: authUser.name,
      tabState: state,
      followingsCount,
      followersCount,
      followedUsers,
    })
  }

  onClickReviewsInfo = () => {
    const { authUser } = this.props

    this.props.navigation.navigate(NAVIGATORS.REVIEWS.name, {
      userId: authUser._id,
      targetId: authUser._id,
    })
  }

  switchViewSelected = (index: number) => {
    this.setState({
      tabIndexSelected: index,
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
        authUser: { facebookUserId = '' },
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
        authUser: { twitterUserId = '' },
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
        authUser: { youtubeUserId = '' },
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
        authUser: { instagramUserId = '' },
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
        authUser: { website = '' },
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
        authUser: { linkedInId = '' },
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
        authUser: { email = '' },
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
      authUser,
      currentUser,
      followingsCount,
      followersCount,
      postsCount,
      reviewsCount,
    } = this.props

    if (isEmpty(authUser)) {
      return null
    }

    const location = get(authUser, 'location', '')
    const ratingAvg = get(authUser, 'ratingAvg', 0)
    const description = get(authUser, 'description', '')
    const referralCode = get(authUser, 'referralCode', '')
    const isBusiness = authUser.accountType === ACCOUNT_TYPE.BUSINESS

    return (
      <View style={styles.userInfoSection}>
        <View style={styles.mainInfo}>
          <View style={styles.mainInfoLeft}>
            <UserAvatar
              imgSrc={authUser.avatar}
              heightOrWidth={116}
              isBusiness={isBusiness}
            />
            <Text style={styles.fullName} numberOfLines={1}>
              {get(authUser, 'name', '')}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon
                type={IconType.AntDesign}
                name={'star'}
                color={COLORS.darkYellow}
                size={10}
              />

              <Text style={styles.rating}>{round(ratingAvg, 2)}</Text>
            </View>

            {authUser._id === currentUser._id && (
              <View style={styles.earnLine}>
                <TouchableOpacity onPress={this.onTokensPress}>
                  <Text style={styles.earnings} numberOfLines={1}>
                    Earnings: {authUser.totalLoyaltyToken || 0} MP Tokens
                  </Text>
                </TouchableOpacity>
                <Text style={styles.comma}>, </Text>
                <TouchableOpacity
                  style={styles.referralCodeContainer}
                  onPress={this.shareReferralToken}>
                  <Text>{referralCode}</Text>
                  <Icon
                    type={IconType.MaterialIcons}
                    name={'content-copy'}
                    color={COLORS.black}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            )}

            {!isEmpty(location) && (
              <Text style={styles.location} numberOfLines={1}>
                {location}
              </Text>
            )}
            {!isEmpty(description) && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>
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
    const { authUser } = this.props
    const isBusiness = authUser.accountType === ACCOUNT_TYPE.BUSINESS

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

  onTokensPress = () => {
    this.props.navigation.navigate(NAVIGATORS.EARNINGS.name)
  }

  publishReferralToken = async () => {
    const {
      authUser: { referralCode },
    } = this.props

    try {
      const result = await Share.share({
        message: `Use my referral code to sign up on MelaninPeople to earn your first tokens ${referralCode} www.melaninpeople.com`,
      })

      this.setState({
        showShareModal: false,
      })
    } catch (error) {}
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
      bottomActionSheetActions: this.sharedPostBottomActionSheetActions,
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

  shareReferralToken = () => {
    this.setState(
      {
        showBottomActionSheet: false,
        showShareModal: false,
        isShareExternal: true,
      },
      () => {
        this.publishReferralToken().then(() => {
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
          const { sharePost } = this.props
          sharePost(this.selectedItemId, text)
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

  onItemViewMorePress = (id: string) => {
    const { posts } = this.props
    this.selectedItemId = id

    const post = posts.find((post) => post._id === id)
    if (!post) {
      return
    }

    this.setState({
      showBottomActionSheet: true,
      bottomActionSheetActions: this.ownedPostBottomActionSheetActions,
    })
  }

  renderPostListItem = ({ item }: { item: Post }) => {
    const { authUser } = this.props

    return (
      <PostItem
        data={item}
        onPressViewMore={this.onItemViewMorePress}
        onRatingButtonPress={this.onItemRatingButtonPress}
        onLikesButtonPress={this.onItemLikesButtonPress}
        onDislikesButtonPress={this.onItemDislikesButtonPress}
        onCommentsButtonPress={this.onCommentsButtonPress}
        currentUserId={authUser._id}
        onAvatarAndUserNamePress={() => {}}
        onShareButtonPress={this.onShareButtonPress}
      />
    )
  }

  onPostThumbnailPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
  }

  renderInfoItem = () => {
    const { authUser, categoriesById } = this.props

    const categoryId = get(authUser, 'subCategory.category', '')
    const categoryName = get(categoriesById, `${categoryId}.name`, '')
    const yearFoundedLong = get(authUser, 'yearFounded.timeStamp', 0)
    const location = get(authUser, 'location', '')

    const finalLocation = !isEmpty(location)
      ? location
      : get(authUser, 'addressOne', '') +
        ' ' +
        get(authUser, 'addressTwo', '') +
        ' ' +
        get(authUser, 'city', '') +
        ' ' +
        get(authUser, 'state', '') +
        ' ' +
        get(authUser, 'zipCode', '')
    const workingHours: any = get(authUser, 'workingHours', [])
    const tagCodes: any = get(authUser, 'tagCodes', [])

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
            {get(authUser, 'aboutCEO', '')}
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
              {get(authUser, 'linkedInId', '')}
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
            {get(authUser, 'phoneNumber', '')}
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

    if (isEmpty(attachments)) {
      return null
    }

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

  onListEndReached = () => {
    const { postPerPage } = this.state
    const {
      pagination: { skip, endReached },
      getPosts,
      loading,
      authUser,
    } = this.props

    if (!getPosts || loading || endReached) {
      return
    }

    getPosts(authUser._id, skip + postPerPage, postPerPage)
  }

  keyExtractor = (item: Post) => {
    const { tabIndexSelected } = this.state

    switch (tabIndexSelected) {
      case 1:
        return `${item.id}-list`

      case 2:
        return `${item.id}-grid`

      default:
        return 'business_information'
    }
  }

  renderItemSeparator = () => {
    return <View style={styles.separatorView} />
  }

  render() {
    const { posts, authUser } = this.props
    const {
      showRatingModal,
      tabIndexSelected,
      showWarningOpenDeeplink,
      showBottomActionSheet,
      showShareModal,
      bottomActionSheetActions,
    } = this.state

    const { commonErrors } = localizedStrings
    const failureOpenLinkMessage = this.handleWarningOpenLinkFailure()
    const isBusiness = authUser.accountType === ACCOUNT_TYPE.BUSINESS
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

        <SharePostModal
          visible={showShareModal}
          onSharePress={this.onShareConfirm}
          transparent={true}
          onOverlayPress={this.onShareModalOverlayPress}
        />

        <BottomActionSheet
          isShowing={showBottomActionSheet}
          actions={bottomActionSheetActions}
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
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 13,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  earnLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnings: {
    fontSize: 14,
    color: COLORS.cornFlowerBlue,
  },
  comma: {
    color: COLORS.black,
  },
  referralCodeContainer: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: COLORS.darkGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainInfoLeft: {
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: COLORS.midGray,
    fontSize: 12,
    marginTop: 5,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },
  description: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginTop: 5,
  },
  rating: {
    color: COLORS.midGray,
    marginLeft: 4,
    fontSize: 15,
    fontWeight: '600',
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
  editButton: {
    flex: 1,
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
    height: 0.5,
    backgroundColor: COLORS.black,
    opacity: 0.2,
    marginHorizontal: 25,
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
    flex: 1,
    includeFontPadding: false,
    fontSize: 15,
  },
  userInfoFirst: {
    includeFontPadding: false,
    fontWeight: 'normal',
    marginLeft: 20,
  },
  userInfoTagFirst: {
    marginTop: 8,
  },
  userInfoSecond: {
    flex: 2,
    marginTop: 8,
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

export default Profile

import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { makeSearchOptions } from './navigation'
import {
  DEFAULT_COMMUNITY_POSTS_PER_PAGE,
  DEFAULT_FEATURE_MEDIA_PER_PAGE,
  DEFAULT_ITEMS_PER_PAGE,
  NEW_POST_MODE,
  STATISTIC_INFO_NAME,
} from 'constants/index'
import COLORS from '../../constants/colors'
import UserAvatar from 'components/UserAvatar'
import localizedStrings from 'localization'
import { NAVIGATORS } from '../../constants/navigators'
import { ACCOUNT_TYPE, ATTACHMENT_TYPE, BottomActionSheetAction } from 'types'
import update from 'immutability-helper'
import { DefaultButton } from 'components/DefaultButton'
import { TopProfileUserType, UserType } from 'types/User.types'
import _, { get, includes, isEmpty, round } from 'lodash'
import { FONT_FAMILIES } from 'constants/fonts'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import PostItem from './components/PostItem/PostItem'
import { Post } from '../../types/Post.types'
import { AirbnbRating } from 'react-native-elements'
import { BottomActionSheet } from '../../components/bottom-action-sheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FollowListItem from './components/FollowListItem/FollowListItemContainer'

interface Props {
  currentUserId: string
  navigation: any
  route: any
  authUser: UserType
  posts: any[]
  userList: any[]
  blockUser: (id: string) => void
  loading: boolean
  pagination: any
  ratePost: (id: string, rating: number) => void
  deletePost: (id: string | null) => void
  getSearchPosts: (skip: number, limit: number, search: string) => void
  followUser: (userId: string) => void
  getUserList: (skip: number, limit: number, search: string) => void
  resetSearch: () => void
  fetchProfilesAndTopBusiness: (userId: string) => void
  resetRecommendTopProfileList: () => void
  fetchFeaturedMedias: (skip: number, limit?: number) => void
  topBusiness: any[]
  topProfiles: any[]
  mediaPagination: any
  mediaList: any[]
}

interface State {
  selectedTab: STATISTIC_INFO_NAME
  followedUsers: any
  selectedItemId: string | null
  searchKeyword: string
  showRatingModal: boolean
  showBottomActionSheet: boolean
  refreshing: boolean
  viewableItemIndexes: number[]
  showShareModal: boolean
  bottomActionSheetActions: BottomActionSheetAction[]
  showSuccessModal: boolean
  successMessage: string
  isShareExternal: boolean
  fetching: boolean
}

const { width: screenWidth } = Dimensions.get('screen')

class Search extends React.Component<Props, State> {
  private selectedItemId: string | null
  private selectedItemPost: Post | null
  private allowMediaType = [ATTACHMENT_TYPE.PHOTO, ATTACHMENT_TYPE.VIDEO]

  otherPostBottomActionSheetActions: BottomActionSheetAction[]
  ownedPostBottomActionSheetActions: BottomActionSheetAction[]
  private readonly debounceSearchByText: (value: string) => void

  constructor(props: Props) {
    super(props)

    this.debounceSearchByText = _.debounce(this.searchByText, 500)
    this.state = {
      searchKeyword: '',
      selectedTab: STATISTIC_INFO_NAME.USERS,
      followedUsers: {},
      showRatingModal: false,
      selectedItemId: null,
      showBottomActionSheet: false,
      refreshing: false,
      viewableItemIndexes: [],
      showShareModal: false,
      bottomActionSheetActions: [],
      showSuccessModal: false,
      successMessage: '',
      isShareExternal: false,
      fetching: false,
    }

    this.otherPostBottomActionSheetActions = [
      {
        renderIcon: () => (
          <Icon
            type={IconType.MaterialIcons}
            name={'report'}
            color={COLORS.coral}
            size={25}
          />
        ),
        text: localizedStrings.home.reportPost,
        onPress: this.onReportPostPress,
      },
      {
        renderIcon: () => (
          <Icon
            type={IconType.Entypo}
            name={'block'}
            color={COLORS.coral}
            size={25}
          />
        ),
        text: localizedStrings.home.blockUser,
        onPress: this.onBlockUserPress,
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

  onReportPostPress = () => {
    this.setState({
      showBottomActionSheet: false,
    })
    this.props.navigation.navigate(NAVIGATORS.REPORT_POST.name, {
      id: this.selectedItemId,
    })
    this.selectedItemId = null
  }

  onRatingModalPressOutside = () => {
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

  onBlockUserPress = () => {
    const { posts, blockUser } = this.props
    const selectedPost = posts.find((post) => post.id === this.selectedItemId)
    if (!selectedPost) {
      return
    }
    const {
      author: { id },
    } = selectedPost
    blockUser(id)

    this.setState({
      showBottomActionSheet: false,
    })
  }

  searchByText = (value: string) => {
    const { selectedTab } = this.state

    if (selectedTab === STATISTIC_INFO_NAME.USERS) {
      //getUsers
      this.props.getUserList(0, DEFAULT_ITEMS_PER_PAGE, value)
    } else if (selectedTab === STATISTIC_INFO_NAME.COMMUNITYFLORNTS) {
      //get Community Flornts
      const perPage = isEmpty(value)
        ? DEFAULT_COMMUNITY_POSTS_PER_PAGE
        : DEFAULT_ITEMS_PER_PAGE
      this.props.getSearchPosts(0, perPage, value)
    }
  }

  handleSearchChange = (searchKeyword: string) => {
    this.setState(
      {
        searchKeyword: searchKeyword,
      },
      () => {
        if (searchKeyword.length > 1) {
          this.debounceSearchByText(searchKeyword)
        } else {
          this.searchByText(searchKeyword)
        }
      },
    )
  }

  searchBlur = () => {}

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { searchKeyword } = this.state
    if (prevState.searchKeyword !== this.state.searchKeyword) {
      this.props.navigation.setOptions(
        makeSearchOptions(
          searchKeyword,
          this.handleSearchChange,
          this.searchBlur,
        ),
      )
    }
  }

  async componentDidMount() {
    const { searchKeyword } = this.state
    const { fetchFeaturedMedias } = this.props

    this.props.navigation.setOptions(
      makeSearchOptions(
        searchKeyword,
        this.handleSearchChange,
        this.searchBlur,
        'Tap the search icon to explore ',
      ),
    )

    if (searchKeyword === '') {
      this.handleSearchChange('')
    }

    fetchFeaturedMedias && fetchFeaturedMedias(0)
  }

  componentWillUnmount() {
    this.props.resetSearch()
  }

  onEditPostPress = () => {
    const { posts } = this.props

    this.setState({
      showBottomActionSheet: false,
    })

    const post = posts.find((postItem) => postItem._id === this.selectedItemId)
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
    this.props.deletePost(this.selectedItemId)
    this.selectedItemId = null
    this.selectedItemPost = null
  }

  handleSelectTab = (tabState: STATISTIC_INFO_NAME) => {
    const { selectedTab } = this.state

    if (selectedTab === tabState) {
      return
    }

    this.setState({ selectedTab: tabState }, () => {
      const { searchKeyword } = this.state
      const {
        posts,
        userList,
        getUserList,
        getSearchPosts,
        mediaList,
        topProfiles,
        topBusiness,
        fetchFeaturedMedias,
        fetchProfilesAndTopBusiness,
      } = this.props

      switch (tabState) {
        case STATISTIC_INFO_NAME.USERS:
          if (searchKeyword.length > 0 || userList.length === 0) {
            getUserList && getUserList(0, DEFAULT_ITEMS_PER_PAGE, searchKeyword)
          }
          break

        case STATISTIC_INFO_NAME.COMMUNITYFLORNTS:
          if (searchKeyword.length > 0 || posts.length === 0) {
            const perPage = isEmpty(searchKeyword)
              ? DEFAULT_COMMUNITY_POSTS_PER_PAGE
              : DEFAULT_ITEMS_PER_PAGE
            getSearchPosts && getSearchPosts(0, perPage, searchKeyword)
          }
          break

        case STATISTIC_INFO_NAME.MEDIA:
          if (isEmpty(mediaList)) {
            fetchFeaturedMedias && fetchFeaturedMedias(0)
          }
          break

        case STATISTIC_INFO_NAME.FOLLOWTOP:
          if (isEmpty(topBusiness) && isEmpty(topProfiles)) {
            fetchProfilesAndTopBusiness &&
              fetchProfilesAndTopBusiness(this.getCurrentUserId())
          }
          break

        default:
          break
      }
    })
  }

  getCurrentUserId = () => {
    return _.get(this.props, 'authUser._id', '')
  }

  handleAvatarAndUserNamePress = (id: string) => {
    const { authUser } = this.props

    if (authUser._id === id) {
      this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
    } else {
      this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
        userId: id,
      })
    }
  }

  handleMediaItemPress = (id: string) => () => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, {
      id,
    })
  }

  onPressFollowUser = (userId: string) => {
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

  keyExtractor = (item: UserType) => {
    const { selectedTab } = this.state
    return `${selectedTab}__${item.id}`
  }

  renderTab = (tabState: STATISTIC_INFO_NAME) => {
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
        <Text style={tabNameStyles}>{tabEnumNames[tabState]}</Text>
      </TouchableOpacity>
    )
  }

  renderEmptyContainer = (type: string) => {
    const { searchKeyword } = this.state
    const { loading } = this.props

    if (searchKeyword.length < 1 && loading) {
      return (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessage}>Loading...</Text>
        </View>
      )
    }

    if (loading) {
      return (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.emptyMessage}>Searching...</Text>
        </View>
      )
    }

    return (
      <View style={styles.emptyMessageContainer}>
        <Text style={styles.emptyMessage}>No {type} found</Text>
      </View>
    )
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

  renderListItem = ({ item: userItemId }: { item: string }) => {
    const { selectedTab, followedUsers } = this.state
    const followedUser = get(followedUsers, userItemId, 0) > 0

    return (
      <FollowListItem
        key={userItemId}
        userItemId={userItemId}
        selectedTab={selectedTab}
        followedUser={followedUser}
        onPressAvatarAndUserName={this.handleAvatarAndUserNamePress}
        onPressFollowUser={this.onPressFollowUser}
      />
    )
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

  renderFollowTopItem = ({ item }: { item: TopProfileUserType }) => {
    const navigateToUserProfile = () =>
      this.handleAvatarAndUserNamePress(item._id)
    const ratingAvg = this.calculateProfileRatingAvg(item)
    const totalStar = round(ratingAvg, 0)

    return (
      <View style={styles.followTopItemWrapper}>
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

  renderMediaItem = ({ item }: any) => {
    const { media = {} } = item
    const mediaType = get(media, 'type', '')
    const videoPreviewUrl = get(media, 'previewUrl', '')
    const photoPreviewUrl = get(media, 'url', '')
    const postId = get(media, 'post', '')

    if (
      isEmpty(media) ||
      !includes(this.allowMediaType, mediaType) ||
      (isEmpty(videoPreviewUrl) && isEmpty(photoPreviewUrl))
    ) {
      return null
    }

    const navigateToPostDetails = this.handleMediaItemPress(postId)
    const mediaStyles = [styles.mediaItemWrapper]
    const isMediaVideo = mediaType === ATTACHMENT_TYPE.VIDEO
    const previewUrl = isMediaVideo ? videoPreviewUrl : photoPreviewUrl

    return (
      <View style={mediaStyles}>
        <TouchableOpacity onPress={navigateToPostDetails}>
          <Image source={{ uri: previewUrl }} style={[styles.mediaItemImage]} />

          {isMediaVideo && (
            <View style={styles.mediaItemVideoPlayView}>
              <Icon
                style={styles.mediaItemVideoPlayIcon}
                type={IconType.FontAwesome5}
                name={'play'}
                color={COLORS.oceanGreen}
                size={22}
              />
            </View>
          )}

          <View style={styles.mediaItemBottomInfo}>
            <Icon
              style={styles.mediaItemBottomViewIcon}
              type={IconType.Entypo}
              name={'eye'}
              color={COLORS.white}
              size={15}
            />

            <Text style={styles.mediaItemBottomViewCount}>
              {item.viewsCount}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  onBottomActionSheetOverlayPress = () => {
    this.setState({
      showBottomActionSheet: false,
    })
  }

  onItemRatingButtonPress = (id: string) => {
    this.selectedItemId = id
    this.setState({
      showRatingModal: true,
    })
  }

  onItemViewMorePress = (id: string) => {
    const { posts, currentUserId } = this.props
    this.selectedItemId = id

    const post = posts.find((postItem) => postItem._id === id)
    if (!post) {
      return
    }

    const {
      author: { _id: authorId },
    } = post

    let bottomActionSheetActions = this.otherPostBottomActionSheetActions
    if (authorId === currentUserId) {
      bottomActionSheetActions = this.ownedPostBottomActionSheetActions
    }

    this.setState({
      showBottomActionSheet: true,
      bottomActionSheetActions,
    })
  }

  onItemCommentsButtonPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
  }

  onViewableItemsChanged = ({ viewableItems }: any) => {
    this.setState({
      viewableItemIndexes: viewableItems.map((item: any) => item.index),
    })
  }

  onListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getSearchPosts,
      loading,
    } = this.props

    const { searchKeyword } = this.state

    if (loading || endReached) {
      return
    }
    const perPage = isEmpty(searchKeyword)
      ? DEFAULT_COMMUNITY_POSTS_PER_PAGE
      : DEFAULT_ITEMS_PER_PAGE
    getSearchPosts(skip + perPage, perPage, searchKeyword)
  }

  onUserListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getUserList,
      loading,
    } = this.props

    const { searchKeyword } = this.state

    if (loading || endReached) {
      return
    }

    getUserList(
      skip + DEFAULT_ITEMS_PER_PAGE,
      DEFAULT_ITEMS_PER_PAGE,
      searchKeyword,
    )
  }

  onMediaListEndReached = () => {
    const {
      mediaPagination: { skip, endReached },
      fetchFeaturedMedias,
      loading,
    } = this.props

    if (loading || endReached) {
      return
    }

    fetchFeaturedMedias &&
      fetchFeaturedMedias(skip + DEFAULT_FEATURE_MEDIA_PER_PAGE)
  }

  onItemAvatarAndUserNamePress = (userId: string) => {
    if (this.props.currentUserId === userId) {
      this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
    } else {
      this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
        userId,
      })
    }
  }

  renderPostItem = ({ item, index }: any) => {
    const { viewableItemIndexes } = this.state
    return (
      <PostItem
        data={item}
        onPressViewMore={this.onItemViewMorePress}
        onRatingButtonPress={this.onItemRatingButtonPress}
        onLikesButtonPress={() => {}}
        onDislikesButtonPress={() => {}}
        onCommentsButtonPress={this.onItemCommentsButtonPress}
        currentUserId={this.props.currentUserId}
        isViewable={viewableItemIndexes.includes(index)}
        onAvatarAndUserNamePress={this.onItemAvatarAndUserNamePress}
        onShareButtonPress={() => {}}
        onPhotoAttachmentPress={this.onItemCommentsButtonPress}
      />
    )
  }

  navigateToSeeAllTopProfiles = (screenTitle: string, profileType: string) => {
    const { resetRecommendTopProfileList, navigation } = this.props

    resetRecommendTopProfileList && resetRecommendTopProfileList()
    navigation.navigate(NAVIGATORS.TOP_PROFILES.name, {
      screenTitle,
      profileType,
    })
  }

  renderFollowTopView = () => {
    const { topProfiles, topBusiness } = this.props

    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.followTopContainer}>
          <View style={styles.followTopHeaderWrapper}>
            <Text style={styles.followTopHeaderText}>
              {'Recommended Profiles'}
            </Text>

            <TouchableOpacity
              onPress={() =>
                this.navigateToSeeAllTopProfiles(
                  'Recommended Profiles',
                  ACCOUNT_TYPE.PERSONAL,
                )
              }>
              <Text>{'See all'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={[styles.followTopListContainer]}
            key={`${STATISTIC_INFO_NAME.FOLLOWTOP}-Profiles`}
            data={topProfiles}
            keyExtractor={(item) => item._id}
            numColumns={2}
            renderItem={this.renderFollowTopItem}
            onEndReachedThreshold={0.7}
            ListEmptyComponent={() => this.renderEmptyContainer('profiles')}
          />

          <View style={styles.followTopHeaderWrapper}>
            <Text style={styles.followTopHeaderText}>
              {'Top Ranked Businesses'}
            </Text>

            <TouchableOpacity
              onPress={() =>
                this.navigateToSeeAllTopProfiles(
                  'Top Ranked Businesses',
                  ACCOUNT_TYPE.BUSINESS,
                )
              }>
              <Text>{'See all'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={[styles.followTopListContainer]}
            key={`${STATISTIC_INFO_NAME.FOLLOWTOP}-Business`}
            data={topBusiness}
            keyExtractor={(item) => item._id}
            numColumns={2}
            renderItem={this.renderFollowTopItem}
            onEndReachedThreshold={0.7}
            ListEmptyComponent={() => this.renderEmptyContainer('business')}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }

  renderMediaView = () => {
    const { mediaList } = this.props

    return (
      <>
        <View style={styles.followTopContainer}>
          <View style={styles.followTopHeaderWrapper}>
            <Text style={styles.followTopHeaderText}>
              {'Featured Pictures and Videos'}
            </Text>
          </View>
        </View>

        <FlatList
          style={[styles.followTopListContainer]}
          key={`${STATISTIC_INFO_NAME.MEDIA}`}
          data={mediaList}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={this.renderMediaItem}
          ListEmptyComponent={() => this.renderEmptyContainer('media')}
          onEndReached={this.onMediaListEndReached}
          onEndReachedThreshold={0.7}
        />
      </>
    )
  }

  renderSelectedTab = (selectedTab: STATISTIC_INFO_NAME) => {
    const { posts, userList } = this.props
    const { viewableItemIndexes } = this.state

    switch (selectedTab) {
      case STATISTIC_INFO_NAME.FOLLOWTOP:
        return this.renderFollowTopView()

      case STATISTIC_INFO_NAME.MEDIA:
        return this.renderMediaView()

      case STATISTIC_INFO_NAME.USERS:
        return (
          <FlatList
            style={[styles.listContainer]}
            key={selectedTab}
            data={userList}
            keyExtractor={(item) => item}
            renderItem={this.renderListItem}
            initialNumToRender={20}
            maxToRenderPerBatch={16}
            onEndReachedThreshold={0.7}
            ListEmptyComponent={() => this.renderEmptyContainer('user')}
            onEndReached={this.onUserListEndReached}
          />
        )

      case STATISTIC_INFO_NAME.COMMUNITYFLORNTS:
        return (
          <FlatList
            data={posts}
            extraData={viewableItemIndexes}
            renderItem={this.renderPostItem}
            style={styles.listContainer}
            onEndReached={this.onListEndReached}
            onEndReachedThreshold={0.7}
            onViewableItemsChanged={this.onViewableItemsChanged}
            windowSize={3}
            ListEmptyComponent={() => this.renderEmptyContainer('post')}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 70,
            }}
          />
        )
    }
  }

  render() {
    const {
      selectedTab,
      bottomActionSheetActions,
      showRatingModal,
      showBottomActionSheet,
    } = this.state

    return (
      <>
        <View style={styles.container}>
          <View style={styles.tabHeader}>
            {this.renderTab(STATISTIC_INFO_NAME.MEDIA)}

            {this.renderTab(STATISTIC_INFO_NAME.USERS)}

            {this.renderTab(STATISTIC_INFO_NAME.FOLLOWTOP)}

            {this.renderTab(STATISTIC_INFO_NAME.COMMUNITYFLORNTS)}
          </View>

          <View style={styles.scrollView}>
            {this.renderSelectedTab(selectedTab)}
          </View>
        </View>

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
          actions={bottomActionSheetActions}
          onOverlayPress={this.onBottomActionSheetOverlayPress}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    justifyContent: 'flex-start',
  },
  tabHeader: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 48,
    maxHeight: 48,
  },
  scrollView: {
    flex: 1,
  },
  tabView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cornFlowerBlue,
  },
  selectedTab: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cornFlowerBlue,
  },
  selectedTabName: {
    color: COLORS.cornFlowerBlue,
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

  emptyMessageContainer: {
    textAlign: 'center',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    flex: 1,
    paddingVertical: 50,
    height: '100%',
    color: COLORS.black,
  },

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
    margin: 10,
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

  mediaItemWrapper: {
    flex: 1,
    margin: 10,
    width: 140,
    height: 240,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: COLORS.lightGray,
  },
  mediaItemImage: {
    flex: 1,
    width: 180,
    height: 240,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  mediaItemVideoPlayView: {
    position: 'absolute',
    width: 60,
    height: 60,
    top: 95,
    left: screenWidth / 4 - 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.overlay,
    borderRadius: 30,
  },
  mediaItemVideoPlayIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 19,
  },
  mediaItemBottomInfo: {
    position: 'absolute',
    height: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    left: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
  },
  mediaItemBottomViewIcon: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginLeft: 15,
    color: COLORS.white,
  },
  mediaItemBottomViewCount: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginHorizontal: 5,
    color: COLORS.white,
  },
})

type TabEnumNamesType = {
  [key in string]: string
}

const tabEnumNames: TabEnumNamesType = {
  [STATISTIC_INFO_NAME.FOLLOWTOP]: 'Users',
  [STATISTIC_INFO_NAME.MEDIA]: 'Media',
  [STATISTIC_INFO_NAME.USERS]: 'Follow',
  [STATISTIC_INFO_NAME.COMMUNITYFLORNTS]: 'Community',
}

export default Search

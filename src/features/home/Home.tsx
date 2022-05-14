import React from 'react'
import {
  FlatList,
  GestureResponderEvent,
  Modal,
  PixelRatio,
  RefreshControl,
  Share,
  StyleSheet,
  View,
} from 'react-native'
import { FAB } from 'react-native-paper'
import PostItem from './components/PostItem/PostItem'
import COLORS from '../../constants/colors'
import { AirbnbRating } from 'react-native-elements'
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links'
import { get, isEmpty } from 'lodash'

import {
  androidPackageName,
  DEFAULT_ITEMS_PER_PAGE,
  dynamicLinkPrefix,
  webAppDynamicPrefix,
  iOSBundleId,
  NEW_POST_MODE,
} from 'constants/index'
import Icon from '../../components/Icon'
import { IconType } from '../../components/Icon/Icon'
import localizedStrings from '../../localization'
import { BottomActionSheet } from '../../components/bottom-action-sheet'
import { BottomActionSheetAction } from 'types'
import { NAVIGATORS } from '../../constants/navigators'
import SharePostModal from 'components/SharePostModal'
import InfoModal from 'components/InfoModal'
import { Post } from '../../types/Post.types'
import MenuOverlay from './components/MenuOverlay/MenuOverlay'

interface Props {
  navigation: any
  route: any
  searchText: string
  posts: any[]
  getPosts: (skip: number, limit: number) => void
  loading: boolean
  likePost: (id: string) => void
  dislikePost: (id: string) => void
  ratePost: (id: string, rating: number) => void
  currentUserId: string
  pagination: any
  sharePost: (id: string | null, text: string) => void
  shareExternalPost: (id: string | null) => void
  deletePost: (id: string | null) => void
  getAllCategory: () => void
  deleteSuccess: boolean
  blockUser: (id: string) => void
  blockUserSuccess: boolean
  blockType: string
}

interface State {
  showRatingModal: boolean
  selectedItemId: string | null
  showBottomActionSheet: boolean
  refreshing: boolean
  viewableItemIndexes: number[]
  showShareModal: boolean
  bottomActionSheetActions: BottomActionSheetAction[]
  showSuccessModal: boolean
  successMessage: string
  isShareExternal: boolean
}

class Home extends React.Component<Props, State> {
  private otherPostBottomActionSheetActions: BottomActionSheetAction[]
  private ownedPostBottomActionSheetActions: BottomActionSheetAction[]
  private sharedPostBottomActionSheetActions: BottomActionSheetAction[]

  private selectedItemId: string | null
  private selectedItemPost: Post | null
  private flatListRef: any | null

  constructor(props: Props) {
    super(props)

    this.state = {
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
    }

    this.otherPostBottomActionSheetActions = [
      {
        renderIcon: () => (
          <Icon
            key="home.reportPost"
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
            key="home.blockUser"
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
            key="home.editPost"
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
            key="home.deletePost"
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

    this.sharedPostBottomActionSheetActions = [
      {
        renderIcon: () => (
          <Icon
            key="home.shareInternal"
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
            key="home.shareExternal"
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
            key="home.shareToChat"
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

  componentDidMount() {
    const { getPosts, getAllCategory } = this.props
    getPosts && getPosts(0, DEFAULT_ITEMS_PER_PAGE)
    getAllCategory && getAllCategory()
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { blockType } = this.props

    if (
      this.props.deleteSuccess &&
      this.props.deleteSuccess !== prevProps.deleteSuccess
    ) {
      this.setState({
        showSuccessModal: true,
        successMessage: localizedStrings.home.deletePostSuccess,
      })
    }

    if (
      this.props.blockUserSuccess &&
      this.props.blockUserSuccess !== prevProps.blockUserSuccess
    ) {
      this.setState({
        showSuccessModal: true,
        successMessage:
          localizedStrings.home[
            blockType === 'unblock' ? 'unBlockUserSuccess' : 'blockUserSuccess'
          ],
      })
    }

    if (
      prevProps.route.params?.selectedChatRoom !==
      this.props.route.params?.selectedChatRoom
    ) {
      const selectedChatRoom = this.props.route.params?.selectedChatRoom
      if (selectedChatRoom) {
        this.shareToChatRoom(selectedChatRoom)
      }
    }
  }

  onPostShareButtonPress = (id: string) => {
    const { posts } = this.props
    const post = posts.find((post) => post._id === id)
    if (!post) {
      return
    }

    this.selectedItemId = id
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
          this.selectedItemId = null
          this.selectedItemPost = null
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

  shareToChatRoom = (chatRoom: any) => {
    const { navigation } = this.props
    navigation.navigate(NAVIGATORS.CHAT_ROOM.name, {
      chatRoomId: chatRoom._id,
      sharedPost: { ...this.selectedItemPost },
    })

    this.selectedItemId = null
    this.selectedItemPost = null
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

  onShareConfirm = (text: string) => {
    const { isShareExternal } = this.state

    if (!isShareExternal) {
      this.setState(
        {
          showShareModal: false,
        },
        () => {
          this.props.sharePost(this.selectedItemId, text)
          this.selectedItemId = null
          this.selectedItemPost = null
        },
      )
    }
  }

  onShareModalOverlayPress = () => {
    this.selectedItemId = null
    this.selectedItemPost = null

    this.setState({
      showShareModal: false,
    })
  }

  renderItem = ({ item, index }: any) => {
    const { viewableItemIndexes } = this.state

    return (
      <PostItem
        data={item}
        onPressViewMore={this.onItemViewMorePress}
        onRatingButtonPress={this.onItemRatingButtonPress}
        onLikesButtonPress={this.onItemLikesButtonPress}
        onDislikesButtonPress={this.onItemDislikesButtonPress}
        onCommentsButtonPress={this.onItemCommentsButtonPress}
        currentUserId={this.props.currentUserId}
        isViewable={viewableItemIndexes.includes(index)}
        onAvatarAndUserNamePress={this.onItemAvatarAndUserNamePress}
        onShareButtonPress={this.onPostShareButtonPress}
        onPhotoAttachmentPress={this.onItemCommentsButtonPress}
      />
    )
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
    this.props.deletePost(this.selectedItemId)
    this.selectedItemId = null
    this.selectedItemPost = null
  }

  onItemViewMorePress = (id: string) => {
    const { posts, currentUserId } = this.props
    this.selectedItemId = id
    const post = posts.find((post) => post._id === id)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onItemCommentsButtonPress = (id: string) => {
    this.props.navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id })
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

  renderItemSeparator = () => {
    return <View style={styles.separatorView} />
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  onListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getPosts,
      loading,
    } = this.props

    if (loading || endReached) {
      return
    }

    getPosts(skip + DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE)
  }

  onBottomActionSheetOverlayPress = () => {
    this.setState({
      showBottomActionSheet: false,
    })
  }

  onRefresh = () => {
    this.props.getPosts(0, DEFAULT_ITEMS_PER_PAGE)
  }

  onViewableItemsChanged = ({ viewableItems }: any) => {
    this.setState({
      viewableItemIndexes: viewableItems.map((item: any) => item.index),
    })
  }

  onSuccessModalOkPress = () => {
    this.setState(
      {
        showSuccessModal: false,
      },
      () => {
        this.props.getPosts(0, DEFAULT_ITEMS_PER_PAGE)
      },
    )
  }

  moveToTop = () => {
    if (!isEmpty(this.flatListRef)) {
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 })
    }
  }

  render() {
    const {
      showRatingModal,
      showBottomActionSheet,
      refreshing,
      viewableItemIndexes,
      showShareModal,
      bottomActionSheetActions,
      showSuccessModal,
      successMessage,
    } = this.state
    const { posts } = this.props

    return (
      <>
        <MenuOverlay />
        <FlatList
          ref={(ref) => {
            this.flatListRef = ref
          }}
          data={posts}
          extraData={viewableItemIndexes}
          renderItem={this.renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={this.renderItemSeparator}
          onEndReached={this.onListEndReached}
          onEndReachedThreshold={0.7}
          onViewableItemsChanged={this.onViewableItemsChanged}
          windowSize={3}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 70,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={COLORS.cornFlowerBlue}
              onRefresh={this.onRefresh}
            />
          }
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
          actions={bottomActionSheetActions}
          onOverlayPress={this.onBottomActionSheetOverlayPress}
        />
        <SharePostModal
          visible={showShareModal}
          onSharePress={this.onShareConfirm}
          transparent={true}
          onOverlayPress={this.onShareModalOverlayPress}
        />

        <InfoModal
          visible={showSuccessModal}
          message={successMessage}
          onOkButtonPress={this.onSuccessModalOkPress}
        />

        <FAB
          style={styles.fab}
          color={COLORS.white}
          icon="arrow-collapse-up"
          onPress={this.moveToTop}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.white,
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 30,
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
  searchButton: {
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default Home

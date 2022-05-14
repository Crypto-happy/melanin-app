import React from 'react'
import {
  Animated,
  FlatList,
  Image,
  InteractionManager,
  Keyboard,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PixelRatio,
  StyleSheet,
  Text,
  Share,
  TouchableOpacity,
  View,
} from 'react-native'
import Hyperlink from 'react-native-hyperlink'
import AttachmentView from 'features/home/components/PostItem/AttachmentView'
import { get, isEmpty, includes, compact } from 'lodash'
import Icon from '../../components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from '../../constants/colors'
import { getScreenOptions } from 'utils/navigation'
import { FONT_FAMILIES } from 'constants/fonts'
import SharePostModal from 'components/SharePostModal'
import moment from 'moment'
import DefaultAvatar from 'components/DefaultAvatar'
import { NAVIGATORS } from 'constants/navigators'
import localizedStrings from 'localization'
import CommentInput from 'features/post-details/components/CommentInput'
import CommentItem from 'features/post-details/components/CommentItem'
import {
  androidPackageName,
  iOSBundleId,
  DEFAULT_ITEMS_PER_PAGE,
  NEW_POST_MODE,
  POST_TYPE,
  dynamicLinkPrefix,
  webAppDynamicPrefix,
} from 'constants'
import { ATTACHMENT_TYPE, BottomActionSheetAction } from 'types'
import Video from 'react-native-video'
import { DefaultButton } from 'components/DefaultButton'
import { openUrl } from 'utils'
import numeral from 'numeral'
import { safeGetOr } from 'utils/fp'
import { BottomActionSheet } from 'components/bottom-action-sheet'
import InfoModal from 'components/InfoModal'
import { Post } from '../../types/Post.types'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import { StackHeaderTitleProps } from '@react-navigation/stack/lib/typescript/src/types'
import FastImage from 'react-native-fast-image'

interface Props {
  route: any
  navigation: any
  getPostById: (id: string) => void
  post: any
  currentUser: any
  likePost: (id: string) => void
  author: any
  sharePost: (id: string, text: string) => void
  shareExternalPost: (id: string | null) => void
  addComment: (postId: string, text: string) => void
  comments: any[]
  getPostComments: (postId: string, skip: number, limit: number) => void
  loading: boolean
  likeComment: (commentId: string) => void
  pagination: {
    skip: number
    endReached: boolean
  }
  replyComment: (commentId: string, text: string) => void
  deletePost: (postId: string) => void
  deleteComment: (commentId: string) => void
  updateComment: (commentId: string, text: string) => void
  blockCommentOwner: (id: string) => void
  deleteSuccess: boolean
}

interface State {
  showShareModal: boolean
  commentInputAnimValue: Animated.Value
  replyingToComment: any
  contentViewable: boolean
  showBottomActionSheet: boolean
  bottomActionSheetActions: BottomActionSheetAction[]
  showDeleteSuccessModal: boolean
  isShareExternal: boolean
  commentId: string
  commentOwnerId: string
  editingComment: any
}

class PostDetails extends React.Component<Props, State> {
  private commentInputRef: any
  private postContentHeight: number
  private currentVideoTime: number
  private videoRef: any
  private floatingVideoRef: any
  private videoPlaybackRate: any
  private otherPostBottomActionSheetActions: BottomActionSheetAction[]
  private ownedPostBottomActionSheetActions: BottomActionSheetAction[]
  private sharedPostBottomActionSheetActions: BottomActionSheetAction[]
  private commentItemBottomActionSheetActions: BottomActionSheetAction[]

  private selectedItemId: string | null
  private selectedItemPost: Post | null

  constructor(props: Props) {
    super(props)

    this.state = {
      showShareModal: false,
      commentInputAnimValue: new Animated.Value(0),
      replyingToComment: null,
      contentViewable: true,
      showBottomActionSheet: false,
      bottomActionSheetActions: [],
      showDeleteSuccessModal: false,
      isShareExternal: false,
      commentId: '',
      commentOwnerId: '',
    }

    this.commentInputRef = React.createRef()
    this.postContentHeight = 0
    this.currentVideoTime = 0
    this.videoRef = React.createRef()
    this.floatingVideoRef = React.createRef()
    this.videoPlaybackRate = 0

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

    this.commentItemBottomActionSheetActions = [
      {
        renderIcon: () => (
          <Icon
            type={IconType.AntDesign}
            name="edit"
            color={COLORS.silverChalice}
            size={25}
          />
        ),
        text: localizedStrings.reportPost.editComment,
        onPress: this.onEditCommentPress,
      },
      {
        renderIcon: () => (
          <Icon
            type={IconType.AntDesign}
            name="delete"
            color={COLORS.silverChalice}
            size={25}
          />
        ),
        text: localizedStrings.reportPost.deleteComment,
        onPress: this.onDeleteCommentPress,
      },
    ]

    this.selectedItemId = null
    this.selectedItemPost = null
  }

  keyboardWillShow = (event: any) => {
    const {
      endCoordinates: { height },
    } = event
    Animated.spring(this.state.commentInputAnimValue, {
      toValue: height,
      useNativeDriver: false,
      bounciness: 0,
    }).start()
  }

  keyboardWillHide = () => {
    Animated.spring(this.state.commentInputAnimValue, {
      useNativeDriver: false,
      toValue: 0,
      bounciness: 0,
    }).start()
  }

  fetchData = () => {
    const { route, getPostById, getPostComments } = this.props

    getPostById(route.params.id)
    getPostComments(route.params.id, 0, DEFAULT_ITEMS_PER_PAGE)
  }

  onViewMorePress = () => {
    const {
      author: { _id: authorId },
      currentUser: { _id: currentUserId },
    } = this.props

    let bottomActionSheetActions = this.otherPostBottomActionSheetActions
    if (authorId === currentUserId) {
      bottomActionSheetActions = this.ownedPostBottomActionSheetActions
    }

    this.setState({
      showBottomActionSheet: true,
      bottomActionSheetActions,
    })
  }

  onCommentViewMorePress = (
    isPostOwner: boolean = false,
    commentId: string,
    commentOwnerId: string,
  ) => {
    let bottomActionSheetActions = this.commentItemBottomActionSheetActions

    if (isPostOwner) {
      bottomActionSheetActions =
        this.postOwnerCommentItemBottomActionSheetActions(commentOwnerId)
    }

    this.setState({
      showBottomActionSheet: true,
      bottomActionSheetActions,
      commentId,
      commentOwnerId,
    })
  }

  componentDidMount() {
    this.fetchData()

    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this.keyboardWillShow)
    Keyboard.removeListener('keyboardDidHide', this.keyboardWillHide)
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const {
      navigation,
      author,
      currentUser: { _id: currentUserId },
    } = this.props
    const name = safeGetOr('Post Detail', 'author.name')(this.props)
    const options = {
      title: name,
      showLogo: false,
      showBackButton: true,
    }
    const authorId = get(author, '_id')
    const isOwned = authorId && currentUserId === authorId
    navigation.setOptions({
      ...getScreenOptions(options),
      headerTitle: () => (
        <TouchableOpacity
          onPress={() => this.handleAvatarAndUserNamePress(authorId)}>
          <Text style={styles.postOwnerName}>{name}</Text>
        </TouchableOpacity>
      ),
      headerRight: () =>
        isOwned ? (
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={this.onViewMorePress}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
            <Icon
              type={IconType.Fontisto}
              name={'more-v-a'}
              color={COLORS.black}
              size={20}
            />
          </TouchableOpacity>
        ) : null,
    })

    if (
      this.state.contentViewable &&
      prevState.contentViewable !== this.state.contentViewable
    ) {
      this.videoRef &&
        this.videoRef.hasOwnProperty('seek') &&
        this.videoRef.seek(this.currentVideoTime)
    }

    if (this.props.route.params.id !== prevProps.route.params.id) {
      this.fetchData()
    }

    if (
      this.props.deleteSuccess &&
      this.props.deleteSuccess !== prevProps.deleteSuccess
    ) {
      this.setState({
        showDeleteSuccessModal: true,
      })
    }
  }

  postOwnerCommentItemBottomActionSheetActions(commentOwnerId: string) {
    const isTheSameUser = commentOwnerId === this.props.currentUser._id
    return compact([
      {
        renderIcon: () => (
          <Icon
            type={IconType.AntDesign}
            name="delete"
            color={COLORS.silverChalice}
            size={25}
          />
        ),
        text: localizedStrings.reportPost.deleteComment,
        onPress: this.onDeleteCommentPress,
      },
      isTheSameUser
        ? {
            renderIcon: () => (
              <Icon
                type={IconType.AntDesign}
                name="edit"
                color={COLORS.silverChalice}
                size={25}
              />
            ),
            text: localizedStrings.reportPost.editComment,
            onPress: this.onEditCommentPress,
          }
        : undefined,
      isTheSameUser
        ? undefined
        : {
            renderIcon: () => (
              <Icon
                type={IconType.Entypo}
                name="block"
                color={COLORS.silverChalice}
                size={25}
              />
            ),
            text: localizedStrings.reportPost.blockCommentOwner,
            onPress: this.onBlockOwnerCommentPress,
          },
    ])
  }

  onVideoProgress = (currentTime: number) => {
    this.currentVideoTime = currentTime
  }

  onPlaybackRateChange = ({ playbackRate }) => {
    this.videoPlaybackRate = playbackRate
  }

  renderAttachment = (attachments: any[]) => {
    const { contentViewable } = this.state

    return (
      <AttachmentView
        videoRef={(ref) => (this.videoRef = ref)}
        attachments={attachments}
        isViewable={contentViewable}
        style={styles.attachmentView}
        onVideoProgress={this.onVideoProgress}
        shouldResumeOnViewable={true}
        onPlaybackRateChange={this.onPlaybackRateChange}
      />
    )
  }

  onLikeButtonPress = () => {
    const { likePost, route } = this.props
    likePost(route.params.id)
  }

  // onShareButtonPress = () => {
  //   this.setState({
  //     showShareModal: true,
  //   })
  // }

  onShareButtonPress = () => {
    const { post } = this.props
    if (!post) {
      return
    }

    this.selectedItemId = post._id
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
        'UNGUESSABLE',
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

  onShareModalOverlayPress = () => {
    this.setState({
      showShareModal: false,
    })
  }

  onShareConfirm = (text: string) => {
    this.setState(
      {
        showShareModal: false,
      },
      () => {
        InteractionManager.runAfterInteractions(() => {
          const { sharePost, post } = this.props
          const id = post.sharedFrom ? post.sharedFrom.id : post.id
          sharePost(id, text)
        })
      },
    )
  }

  handleAvatarAndUserNamePress = (id: string) => {
    if (this.props.currentUser.id === id) {
      this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
    } else {
      this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
        userId: id,
      })
    }
  }

  renderSharedPost = (sharedPost: any) => {
    const {
      text,
      author: { id, avatar, name },
      attachments,
      createdAt,
    } = sharedPost
    const formattedCreatedTime = moment(createdAt).fromNow()

    return (
      <View style={styles.childPost}>
        <View style={styles.topInfo}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => this.handleAvatarAndUserNamePress(id)}>
            {avatar ? (
              <FastImage source={{ uri: avatar }} style={styles.userAvatar} />
            ) : (
              <DefaultAvatar style={styles.userAvatar} iconSize={30} />
            )}
            <Text style={styles.userName} numberOfLines={1}>
              {name}
            </Text>
          </TouchableOpacity>
          <View style={styles.topRightContent}>
            <Text style={styles.createdTime}>{formattedCreatedTime}</Text>
          </View>
        </View>

        {!isEmpty(attachments) && this.renderAttachment(attachments)}

        {this.renderPostContent(sharedPost)}
      </View>
    )
  }

  onCommentButtonPress = () => {
    this.commentInputRef.focus()
  }

  onHeaderLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { height },
      },
    } = event
    this.postContentHeight = height - 100
  }

  renderPostContent = (post: any) => {
    const { text, type, product } = post

    if (type === POST_TYPE.NORMAL && !isEmpty(text)) {
      return (
        <Hyperlink linkDefault={true} linkStyle={styles.linkStyle}>
          <Text style={styles.postText}>{text.trim()}</Text>
        </Hyperlink>
      )
    }

    if (type === POST_TYPE.PRODUCT && !isEmpty(product)) {
      const { name, price, salePrice, link } = product
      const formattedPrice = numeral(price).format('0,0.[00]')
      const formattedSalePrice = salePrice
        ? numeral(salePrice).format('0,0.[00]')
        : ''

      return (
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{name}</Text>
          {!isEmpty(text) && (
            <Text style={[styles.postText, styles.postTextInProduct]}>
              {text.trim()}
            </Text>
          )}
          <View style={styles.productBottom}>
            <View style={styles.productPricesContainer}>
              <Text
                style={[
                  styles.productPriceNormal,
                  salePrice && styles.productPriceSale,
                ]}
                numberOfLines={1}>
                ${formattedPrice}
              </Text>
              {salePrice && (
                <Text style={styles.productPriceNormal} numberOfLines={1}>
                  ${formattedSalePrice}
                </Text>
              )}
            </View>

            <DefaultButton
              style={styles.buyButton}
              text={localizedStrings.common.buy.toUpperCase()}
              onPress={!isEmpty(link) ? () => openUrl(link) : undefined}
            />
          </View>
        </View>
      )
    }

    return null
  }

  renderListHeader = () => {
    const { post, currentUser } = this.props
    const { attachments, likes, sharedFrom, createdAt } = post
    const buttonHitSlop = { top: 12, right: 12, bottom: 12, left: 12 }
    const liked = likes?.includes(currentUser._id)
    const formattedCreatedTime = moment(createdAt).fromNow()

    return (
      <View style={styles.headerContainer} onLayout={this.onHeaderLayout}>
        <View style={styles.topInfo}>
          <View style={styles.topRightContent}>
            <Text style={styles.createdTime}></Text>
          </View>

          <View style={styles.postDateTimeContent}>
            <Text style={styles.createdTime}>{formattedCreatedTime}</Text>
          </View>
        </View>

        {!isEmpty(attachments) && this.renderAttachment(attachments)}

        {this.renderPostContent(post)}

        {!isEmpty(sharedFrom) && this.renderSharedPost(sharedFrom)}

        <View style={styles.bottomContainer}>
          <View style={styles.bottomItemBarWrapper}>
            <TouchableOpacity
              style={styles.likeButton}
              hitSlop={buttonHitSlop}
              onPress={this.onLikeButtonPress}>
              <Icon
                type={IconType.AntDesign}
                name={liked ? 'heart' : 'hearto'}
                color={COLORS.red}
                size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.commentButton}
              hitSlop={buttonHitSlop}
              onPress={this.onCommentButtonPress}>
              <Icon
                type={IconType.MaterialCommunityIcons}
                name={'comment-text'}
                color={COLORS.silver}
                size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.likeButton}
              hitSlop={buttonHitSlop}
              onPress={this.onShareButtonPress}>
              <Icon
                type={IconType.MaterialCommunityIcons}
                name={'share'}
                color={COLORS.silver}
                size={25}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomItemBarWrapper}>
            <Text>{`${post.viewsCount} views`}</Text>
          </View>
        </View>

        <View style={styles.dividerView} />

        <Text style={styles.commentSectionTitle}>
          {localizedStrings.postDetails.comments}
        </Text>
      </View>
    )
  }

  onAuthorPress = (userId: string) => {
    if (this.props.currentUser.id === userId) {
      this.props.navigation.navigate(NAVIGATORS.PROFILE_STACK.name)
    } else {
      this.props.navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
        userId,
      })
    }
  }

  renderItem = ({ item }) => {
    const {
      author: { _id: authorId },
      currentUser: { _id: currentUserId },
    } = this.props

    return (
      <CommentItem
        data={item}
        onLikeCommentButtonPress={this.onLikeCommentButtonPress}
        currentUserId={currentUserId}
        onReplyButtonPress={this.onReplyCommentButtonPress}
        onAuthorPress={this.onAuthorPress}
        onCommentViewMore={this.onCommentViewMorePress}
        isPostOwner={authorId === currentUserId}
      />
    )
  }

  onSendButtonPress = (text: string) => {
    const { addComment, route, replyComment, updateComment } = this.props
    const { replyingToComment, editingComment } = this.state

    if (replyingToComment) {
      replyComment(replyingToComment.id, text)
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          replyingToComment: null,
        })
      })
    } else if (editingComment) {
      updateComment(editingComment.id, text)
      InteractionManager.runAfterInteractions(() => {
        this.setState({
          editingComment: null,
        })
      })
    } else {
      addComment(route.params.id, text)
    }
  }

  renderCommentItemSeparator = () => {
    return <View style={styles.commentItemSeparator} />
  }

  onListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getPostComments,
      loading,
      route,
    } = this.props

    if (loading || endReached) {
      return
    }

    getPostComments(
      route.params.id,
      skip + DEFAULT_ITEMS_PER_PAGE,
      DEFAULT_ITEMS_PER_PAGE,
    )
  }

  onLikeCommentButtonPress = (commentId: string) => {
    const { likeComment } = this.props
    likeComment(commentId)
  }

  onReplyCommentButtonPress = (commentId: string) => {
    this.setState(
      {
        editingComment: null,
        replyingToComment: this.props.comments.find(
          (comment) => comment._id === commentId,
        ),
      },
      () => {
        this.commentInputRef.focus()
      },
    )
  }

  onCancelReplying = () => {
    this.setState({
      replyingToComment: null,
    })
  }

  onCancelEditing = () => {
    this.setState({
      editingComment: null,
    })
  }

  setCommentInputRef = (ref: any) => {
    this.commentInputRef = ref
  }

  onListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      nativeEvent: {
        contentOffset: { y: scrollHeight },
      },
    } = event
    const { contentViewable } = this.state
    if (
      contentViewable &&
      this.postContentHeight > 0 &&
      scrollHeight > this.postContentHeight
    ) {
      return this.setState({
        contentViewable: false,
      })
    }
    if (
      !contentViewable &&
      this.postContentHeight > 0 &&
      scrollHeight < this.postContentHeight
    ) {
      return this.setState({
        contentViewable: true,
      })
    }
  }

  renderFloatingVideoView = (attachment: any) => {
    const { url } = attachment
    return (
      <Video
        ref={(ref) => (this.floatingVideoRef = ref)}
        style={styles.floatingVideoContainer}
        source={{ uri: url }}
        paused={false}
        onLoad={() => {
          this.floatingVideoRef.seek(this.currentVideoTime)
        }}
        progressUpdateInterval={500}
        onProgress={(data) => this.onVideoProgress(data.currentTime)}
      />
    )
  }

  onBottomActionSheetOverlayPress = () => {
    this.setState({
      showBottomActionSheet: false,
    })
  }

  onEditPostPress = () => {
    const { post } = this.props
    this.setState({
      showBottomActionSheet: false,
    })
    this.props.navigation.navigate(NAVIGATORS.EDIT_POST.name, {
      post,
      mode: NEW_POST_MODE.EDIT,
    })
  }

  onDeletePostPress = () => {
    const { post } = this.props
    this.props.navigation.goBack()
    this.setState({
      showBottomActionSheet: false,
    })
    this.props.deletePost(post._id)
  }

  onDeleteCommentPress = () => {
    const { deleteComment } = this.props
    const { commentId } = this.state
    deleteComment && deleteComment(commentId)

    this.setState({
      showBottomActionSheet: false,
      commentId: '',
      commentOwnerId: '',
    })
  }

  onEditCommentPress = () => {
    const { commentId } = this.state
    this.setState(
      {
        showBottomActionSheet: false,
        replyingToComment: null,
        editingComment: this.props.comments.find(
          (comment) => comment._id === commentId,
        ),
      },
      () => {
        this.commentInputRef.focus()
      },
    )
  }

  onBlockOwnerCommentPress = () => {
    const { blockCommentOwner } = this.props
    const { commentOwnerId } = this.state
    blockCommentOwner && blockCommentOwner(commentOwnerId)

    this.setState({
      showBottomActionSheet: false,
      commentId: '',
      commentOwnerId: '',
    })
  }

  onDeleteSuccessModalOkButtonPress = () => {
    this.setState({
      showDeleteSuccessModal: false,
    })
    this.props.navigation.goBack()
  }

  render() {
    if (Object.keys(this.props.post).length === 0) {
      return null
    }
    const {
      comments,
      author,
      currentUser: { _id: currentUserId },
    } = this.props
    const {
      showShareModal,
      commentInputAnimValue,
      replyingToComment,
      contentViewable,
      showBottomActionSheet,
      bottomActionSheetActions,
      showDeleteSuccessModal,
    } = this.state
    const commentInputAnimatedStyle = {
      bottom: commentInputAnimValue,
    }
    const attachments = safeGetOr(
      [],
      'post.attachments',
    )(this.props).filter((i) => Boolean(i))
    const replyingTo = safeGetOr('', 'author.name')(replyingToComment)
    const hasVideoAttachment =
      safeGetOr(null, '[0].type')(attachments) === ATTACHMENT_TYPE.VIDEO
    const shouldRenderFloatingVideoView =
      !contentViewable && hasVideoAttachment && this.videoPlaybackRate !== 0
    const attachment = safeGetOr(null, '[0]')(attachments)

    const blockedUsers = get(author, 'blockedUsers', [])
    let isUserBlocked = includes(blockedUsers, currentUserId)

    const listExtraData = {
      contentViewable,
      post: this.props.post,
    }

    return (
      <>
        <FlatList
          extraData={listExtraData}
          data={comments}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderListHeader}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={this.renderCommentItemSeparator}
          onEndReached={this.onListEndReached}
          onEndReachedThreshold={0.7}
          onScroll={this.onListScroll}
          scrollEventThrottle={250}
        />
        {shouldRenderFloatingVideoView &&
          this.renderFloatingVideoView(attachment)}

        {!isUserBlocked && (
          <CommentInput
            inputRef={this.setCommentInputRef}
            initialText={
              this.state.editingComment ? this.state.editingComment.text : null
            }
            editingComment={!!this.state.editingComment}
            containerStyle={[
              styles.commentInputContainer,
              commentInputAnimatedStyle,
            ]}
            onSendButtonPress={this.onSendButtonPress}
            replyingTo={replyingTo}
            onCancelReplying={this.onCancelReplying}
            onCancelEditing={this.onCancelEditing}
          />
        )}

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
        <InfoModal
          visible={showDeleteSuccessModal}
          message={localizedStrings.postDetails.deleteSuccess}
          onOkButtonPress={this.onDeleteSuccessModalOkButtonPress}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: COLORS.white,
    paddingTop: 10,
  },
  listContainer: {
    paddingBottom: 100,
  },
  postOwnerName: {
    color: COLORS.black,
    fontSize: 18,
    fontFamily: FONT_FAMILIES.MONTSERRAT_BOLD,
  },
  headerContainer: {
    paddingHorizontal: 19,
    marginBottom: 20,
  },
  attachmentView: {
    marginBottom: 14,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomItemBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 27,
  },
  commentButton: {
    marginRight: 27,
  },
  dividerView: {
    height: 1 / PixelRatio.get(),
    backgroundColor: COLORS.geyser,
  },
  postText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
  },
  childPost: {
    alignItems: 'stretch',
    paddingLeft: 19,
    marginTop: 10,
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
  postDateTimeContent: {
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
  commentSectionTitle: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 11,
  },
  commentInputContainer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    elevation: 2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: -3 },
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    backgroundColor: COLORS.white,
  },
  commentItemSeparator: {
    marginVertical: 12,
  },
  floatingVideoContainer: {
    position: 'absolute',
    top: 0,
    right: 19,
    width: 65,
    height: 65,
    backgroundColor: COLORS.black,
  },
  productInfoContainer: {
    alignItems: 'stretch',
  },
  productName: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 7,
  },
  productBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  productPricesContainer: {
    flex: 1,
  },
  productPriceNormal: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 26,
    color: COLORS.black,
  },
  productPriceSale: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 17,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: COLORS.black,
    opacity: 0.3,
  },
  buyButton: {
    flex: 1,
    height: 47,
  },
  postTextInProduct: {
    fontSize: 13,
    opacity: 0.56,
  },
  viewMoreButton: {
    marginRight: 20,
  },
  linkStyle: {
    color: COLORS.website,
  },
})

export default PostDetails

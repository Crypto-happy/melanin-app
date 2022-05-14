import React from 'react'
import {
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Actions,
  GiftedChat,
  Send,
  MessageText,
} from 'react-native-gifted-chat'
import Clipboard from '@react-native-clipboard/clipboard'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'
import localizedStrings from 'localization'
import { debounce, get, head, isEmpty } from 'lodash'
import ImagePicker from 'react-native-image-crop-picker'
import { ATTACHMENT_TYPE } from 'types'
import { getFileNameFromPath } from 'utils'
import ImageGallery from 'components/ImageGallery'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import { FONT_FAMILIES } from '../../constants/fonts'
import { DefaultButton } from '../../components/DefaultButton'
import { UserType } from '../../types/User.types'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Sound from 'react-native-sound'
import AudioRecordInputToolbar from './components/AudioRecordInputToolbar'
import AudioMessage from './components/AudioMessage'
import BubbleChatMessage from './components/BubbleChatMessage'
import { MESSAGE_TYPE } from '../../constants/chats'
import { NAVIGATORS } from 'constants/navigators'

interface Props {
  navigation: any
  chatRoomId: string
  route: any
  getChatMessages: (chatRoomId: string, skip: number, limit: number) => void
  chatMessages: any[]
  pagination: any
  loading: boolean
  currentUser: any
  emitChatMessage: (chatMessage: any) => void
  emitDeleteChatMessage: (chatMessage: any) => void
  createChatRoom: (userId: string) => void
  chatRoom: any
  isTyping: boolean
  emitIsTyping: (isTyping: boolean, chatRoomId: string) => void
  emitImagesMessage: (attachments: any[], chatRoomId: string) => void
  putBlockChatRoom: (chatRoomId: string) => void
  putAllowChatRoom: (chatRoomId: string) => void
  putMuteChatRoom: (chatRoomId: string) => void
  putDeleteChatRoom: (chatRoomId: string) => void
  emitAudioMessage: (audio: any, chatRoomId: string) => void
  sharedPost: any
  getChatRoomOfMessage: (messageId: string) => void
  clearChatMessagesCache: () => void
  error: any
}

interface State {
  targetUser: UserType
  isRoomOwner: boolean
  hasPermission: boolean
  currentAudioTime: number
  startAudio: boolean
  playAudio: boolean
  playAudioMessageId: string
  audioFileName: string
  audioPath: string
  audioSettings: any
  cancelRecording: boolean
  showRoomSubMenuHeader: boolean
  selectedMessage: any
  isReplying: boolean
  replyingMessage: any
  showDeleteModal: boolean
}

class ChatRoom extends React.Component<Props, State> {
  giftedChatRef: GiftedChat | null = null
  debouncedOnInputTextChanged: any
  playingSound: Sound | null = null
  stopCurrentPlayer: Function | null = null
  unselectMessage: Function | null = null

  static navigationOptions = { title: 'Welcome', headerShown: false }

  constructor(props: Props) {
    super(props)
    const { chatRoom, currentUser } = props

    this.debouncedOnInputTextChanged = debounce(this.onInputTextChanged, 1000, {
      leading: true,
    })

    const chattingWithUser = this.findChattingUserInRoom(chatRoom, currentUser)
    const isRoomOwner = this.isChatRoomOwner(chatRoom, currentUser)

    this.state = {
      targetUser: chattingWithUser,
      isRoomOwner,
      showRoomSubMenuHeader: false,
      hasPermission: false,
      currentAudioTime: 0.0,
      startAudio: false,
      playAudio: false,
      playAudioMessageId: '',
      audioFileName: '',
      audioPath: '',
      cancelRecording: false,
      selectedMessage: null,
      isReplying: false,
      replyingMessage: null,
      showDeleteModal: false,
      audioSettings: {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'aac',
        MeteringEnabled: true,
        IncludeBase64: true,
        AudioEncodingBitRate: 32000,
      },
    }
  }

  messageIdGenerator = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        // eslint-disable-next-line no-bitwise
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  findChattingUserInRoom = (chatRoom: any, currentUser: UserType) => {
    if (!isEmpty(chatRoom)) {
      const { users } = chatRoom
      return users.find((user: UserType) => user._id !== currentUser._id)
    }

    return null
  }

  isChatRoomOwner = (
    chatRoom: { users: Array<UserType> },
    currentUser: UserType,
  ) => {
    if (!isEmpty(chatRoom)) {
      const { users } = chatRoom
      const firstUser = head(users)

      return firstUser ? firstUser._id === currentUser._id : false
    }

    return false
  }

  componentDidMount() {
    const {
      createChatRoom,
      route,
      chatRoom,
      getChatMessages,
      sharedPost,
      getChatRoomOfMessage,
    } = this.props

    const userId = get(route.params, 'userId')
    const messageId = get(route.params, 'messageId')
    if (messageId) {
      getChatRoomOfMessage(messageId)
    } else if (!isEmpty(chatRoom)) {
      const { _id } = chatRoom
      getChatMessages(_id, 0, DEFAULT_ITEMS_PER_PAGE)
    }

    if (!isEmpty(sharedPost)) {
      this.sharePost(sharedPost)
    }

    if (userId) {
      createChatRoom(userId)
    }

    this.checkPermission().then(async (hasPermission) => {
      this.setState({ hasPermission })

      if (!hasPermission) {
        return
      }

      AudioRecorder.onProgress = (data) => {
        this.setState({ currentAudioTime: Math.floor(data.currentTime) })
      }

      AudioRecorder.onFinished = (data) => this.uploadRecordedAudio(data)
    })
  }

  componentDidUpdate(prevProps: Props) {
    const { chatRoom, getChatMessages, currentUser } = this.props
    if (!isEmpty(chatRoom) && isEmpty(prevProps.chatRoom)) {
      const targetUser = this.findChattingUserInRoom(chatRoom, currentUser)
      const isRoomOwner = this.isChatRoomOwner(chatRoom, currentUser)

      this.setState({ targetUser, isRoomOwner }, () => {
        getChatMessages(chatRoom._id, 0, DEFAULT_ITEMS_PER_PAGE)
      })
    }

    if (!isEmpty(chatRoom) && chatRoom.blocked) {
      this.cleanAndGoBack()
    }

    if (
      prevProps.route.params?.selectedChatRoom !==
      this.props.route.params?.selectedChatRoom
    ) {
      const selectedChatRoom = this.props.route.params?.selectedChatRoom
      if (selectedChatRoom) {
        this.forwardMessageTo(selectedChatRoom)
      }
    }
  }

  cleanAndGoBack = () => {
    const { clearChatMessagesCache, navigation } = this.props
    clearChatMessagesCache && clearChatMessagesCache()
    navigation.goBack()
  }

  checkPermission = async () => {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true)
    }

    const rationale = {
      title: 'Microphone Permission',
      message:
        'AudioExample needs access to your microphone so you can record audio.',
      buttonPositive: '',
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      rationale,
    )

    return !isEmpty(result) && result === PermissionsAndroid.RESULTS.GRANTED
  }

  onSend = (messages: any[]) => {
    const { chatRoom, emitChatMessage, emitIsTyping } = this.props
    const { replyingMessage } = this.state
    const message = messages[0]

    const roomId = chatRoom._id
    message.chatRoom = roomId

    if (!isEmpty(replyingMessage)) {
      message.replyMessage = replyingMessage._id
    }

    emitChatMessage(messages[0])
    emitIsTyping(false, roomId)
    this.setState({ isReplying: false, replyingMessage: null })
  }

  openImagesPicker = () => {
    const { chatRoom, emitImagesMessage } = this.props
    return ImagePicker.openPicker({
      cropping: true,
      mediaType: 'photo',
      width: 500,
      height: 500,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 0.8,
      freeStyleCropEnabled: true,
      cropperToolbarColor: COLORS.white,
      cropperTintColor: COLORS.cornFlowerBlue,
      cropperActiveWidgetColor: COLORS.cornFlowerBlue,
      multiple: true,
      maxFiles: 4,
    }).then((images: any) => {
      const attachments = images.map((image: any) => ({
        type: ATTACHMENT_TYPE.PHOTO,
        source: image.path,
        mime: image.mime,
        fileName: image.filename || getFileNameFromPath(image.path),
      }))
      emitImagesMessage(attachments, chatRoom._id)
    })
  }

  recordAudio = async () => {
    const { currentUser } = this.props
    const { hasPermission, audioSettings } = this.state

    if (!hasPermission) {
      return
    }

    const audioFileName = `${currentUser._id}_${this.messageIdGenerator()}.aac`
    const audioPath = `${AudioUtils.DocumentDirectoryPath}/${audioFileName}`
    await AudioRecorder.prepareRecordingAtPath(audioPath, audioSettings)

    if (!this.state.startAudio) {
      this.setState(
        {
          currentAudioTime: 0.0,
          startAudio: true,
          cancelRecording: false,
          audioFileName,
          audioPath,
        },
        async () => {
          await AudioRecorder.startRecording()
        },
      )
    }
  }

  stopRecordAudio = async () => {
    this.setState({ startAudio: false, cancelRecording: false }, async () => {
      await AudioRecorder.stopRecording()
    })
  }

  cancelRecordAudio = async () => {
    this.setState({ startAudio: false, cancelRecording: true }, async () => {
      await AudioRecorder.stopRecording()
    })
  }

  uploadRecordedAudio = (audio: any) => {
    if (audio.status !== 'OK' || this.state.cancelRecording) {
      return
    }

    const { audioFileName, audioPath, currentAudioTime } = this.state
    const audioAttachment = {
      type: ATTACHMENT_TYPE.AUDIO,
      source: Platform.select({
        ios: audioPath,
        android: `file://${audioPath}`,
      }),
      mime: 'audio/aac',
      fileName: audioFileName,
      duration: currentAudioTime,
    }

    const { chatRoom, emitAudioMessage } = this.props
    emitAudioMessage && emitAudioMessage(audioAttachment, chatRoom._id)
  }

  stopAudio = () => {
    this.setState({
      playAudio: false,
    })

    if (isEmpty(this.playingSound)) {
      return
    }

    this.playingSound && this.playingSound.stop()
    this.playingSound = null
    this.stopCurrentPlayer && this.stopCurrentPlayer()
    this.stopCurrentPlayer = null
  }

  playAudio = (audio: any, messageId: string, onComplete: Function) => {
    this.playingSound && this.playingSound.stop()
    this.stopCurrentPlayer && this.stopCurrentPlayer()
    this.stopCurrentPlayer = null

    this.setState({
      playAudio: true,
      playAudioMessageId: messageId,
    })

    this.playingSound = new Sound(audio.url, '', (error) => {
      if (error || isEmpty(this.playingSound)) {
        // eslint-disable-next-line no-console
        console.log('failed to load the sound', error)
      }

      this.stopCurrentPlayer = onComplete
      this.playingSound?.play((success) => {
        if (!success) {
          // eslint-disable-next-line no-console
          console.log('There was an error playing this audio')
        }

        // eslint-disable-next-line no-console
        console.log('There was an successfull playing this audio')
        this.stopCurrentPlayer && this.stopCurrentPlayer()
        this.stopCurrentPlayer = null
        this.setState({ playAudio: false, playAudioMessageId: '' })
      })
    })
  }

  blockRoom = () => {
    const { putBlockChatRoom, chatRoom } = this.props
    const chatRoomId = get(chatRoom, '_id', '')
    putBlockChatRoom && putBlockChatRoom(chatRoomId)
  }

  allowRoom = () => {
    const { putAllowChatRoom, chatRoom } = this.props
    const chatRoomId = get(chatRoom, '_id', '')
    putAllowChatRoom && putAllowChatRoom(chatRoomId)
  }

  muteRoom = () => {
    const { putMuteChatRoom, chatRoom } = this.props
    const chatRoomId = get(chatRoom, '_id', '')
    putMuteChatRoom && putMuteChatRoom(chatRoomId)
  }

  showConfirmationDelete = () => {
    this.setState({ showDeleteModal: true, showRoomSubMenuHeader: false })
  }

  hideConfirmationDelete = () => {
    this.setState({ showDeleteModal: false })
  }

  deleteRoom = () => {
    const { putDeleteChatRoom, chatRoom, navigation } = this.props
    const chatRoomId = get(chatRoom, '_id', '')
    putDeleteChatRoom && putDeleteChatRoom(chatRoomId)
    this.cleanAndGoBack()
  }

  renderWarningForStrangerFooter = () => {
    const { navigation, currentUser } = this.props
    const { targetUser } = this.state

    const hasFollowing = currentUser.followings.find(
      (userId: string) => userId === targetUser._id,
    )

    if (!isEmpty(hasFollowing)) {
      return <View />
    }

    return (
      <View style={styles.warningContainer}>
        <Icon
          style={styles.warningIcon}
          type={IconType.MaterialCommunityIcons}
          name={'message-alert'}
          color={COLORS.white}
          size={26}
        />

        <View style={styles.warningContent}>
          <Text>{localizedStrings.chatRoom.warningStrangerMessage}</Text>

          <View style={styles.warningActionWrapper}>
            <DefaultButton
              contentContainerStyle={styles.warningActionButton}
              text={localizedStrings.chatRoom.allowActionText}
              onPress={this.allowRoom}
            />

            <TouchableOpacity
              style={[styles.warningActionButton, styles.customActionButton]}
              onPress={this.blockRoom}>
              <Text style={styles.blockActionText}>
                {localizedStrings.chatRoom.blockActionText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.warningActionButton, styles.customActionButton]}
              onPress={this.cleanAndGoBack}>
              <Text style={styles.ignoreActionText}>
                {localizedStrings.chatRoom.ignoreActionText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  getContentTypeFromMessage = (message: any) => {
    const content = get(message, 'text', '')
    const audio = get(message, 'audio', '')
    const image = get(message, 'image', '')

    if (!isEmpty(content)) {
      return MESSAGE_TYPE.TEXT
    } else if (!isEmpty(audio)) {
      return MESSAGE_TYPE.AUDIO
    } else if (!isEmpty(image)) {
      return MESSAGE_TYPE.PHOTO
    } else {
      return MESSAGE_TYPE.NONE
    }
  }

  getContentTextFromType = (message: any, contentType: string) => {
    switch (contentType) {
      case MESSAGE_TYPE.TEXT:
        return get(message, 'text', '')

      case MESSAGE_TYPE.PHOTO:
        return localizedStrings.chatRoom.contentPhoto

      case MESSAGE_TYPE.AUDIO:
        return localizedStrings.chatRoom.contentAudio

      default:
        return ''
    }
  }

  generateReplyMessageProps = (message: any) => {
    if (isEmpty(message)) {
      return {
        hasReply: false,
        replyName: '',
        contentType: MESSAGE_TYPE.NONE,
        content: '',
        showContentTypeIcon: false,
        iconName: '',
      }
    }

    const replyName = get(message, 'user.name', '')

    const contentType = this.getContentTypeFromMessage(message)
    const content = this.getContentTextFromType(message, contentType)
    const showContentTypeIcon =
      contentType === MESSAGE_TYPE.PHOTO || contentType === MESSAGE_TYPE.AUDIO

    let iconName = ''
    if (contentType === MESSAGE_TYPE.AUDIO) {
      iconName = 'microphone'
    } else if (contentType === MESSAGE_TYPE.PHOTO) {
      iconName = 'file-photo-o'
    }

    return {
      hasReply: contentType !== MESSAGE_TYPE.NONE,
      replyName,
      contentType,
      content,
      showContentTypeIcon,
      iconName,
    }
  }

  pressAvatar = (user: any) => {
    const { id: userId } = user
    const { navigation } = this.props
    navigation.navigate(NAVIGATORS.USER_PROFILE.name, {
      userId,
    })
  }

  renderReplyPreviewFooter = () => {
    const { replyingMessage } = this.state

    const { replyName, content, showContentTypeIcon, iconName } =
      this.generateReplyMessageProps(replyingMessage)

    return (
      <View style={styles.replyFooterContainer}>
        <View style={styles.replyFooterContentWrapper}>
          <Text style={styles.replyFooterTitle}>
            {localizedStrings.chatRoom.replyingTo} {replyName}
          </Text>

          <View style={styles.replyFooterDescriptionWrapper}>
            <Text style={styles.replyFooterDescriptionText}>{content}</Text>

            {showContentTypeIcon && (
              <Icon
                style={styles.replyFooterDescriptionType}
                type={IconType.FontAwesome}
                name={iconName}
                color={COLORS.silver}
                size={14}
              />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.replyFooterCancelButton}
          onPress={() => {
            this.setState({ isReplying: false, replyingMessage: null })
          }}>
          <Icon
            type={IconType.Ionicons}
            name={'md-close'}
            color={COLORS.silver}
            size={20}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderFooter = () => {
    const { isRoomOwner, isReplying } = this.state
    const { chatRoom = {} } = this.props
    const { allowed = false } = chatRoom

    if (isReplying) {
      return this.renderReplyPreviewFooter()
    } else if (allowed || isRoomOwner) {
      return <View />
    } else {
      return this.renderWarningForStrangerFooter()
    }
  }

  renderActions = (props: any) => {
    return (
      <Actions
        {...props}
        containerStyle={styles.composerActionsButton}
        onPressActionButton={this.openImagesPicker}
        icon={() => (
          <Icon
            type={IconType.MaterialIcons}
            name={'attach-file'}
            color={COLORS.easternBlue}
            size={24}
          />
        )}
      />
    )
  }

  renderSend = (props: any) => {
    const currentTypingText = get(props, 'text', '')

    if (isEmpty(currentTypingText)) {
      return (
        <TouchableOpacity
          style={styles.recordMicrophoneButton}
          onLongPress={this.recordAudio}>
          <Icon
            type={IconType.Feather}
            name="mic"
            color={COLORS.easternBlue}
            size={20}
          />
        </TouchableOpacity>
      )
    }

    return (
      <Send {...props} containerStyle={styles.composerSendButton}>
        <Icon
          type={IconType.MaterialIcons}
          name={'send'}
          color={COLORS.cornFlowerBlue}
          size={24}
        />
      </Send>
    )
  }

  unselectMessageItem = () => {
    this.unselectMessage && this.unselectMessage()
    this.unselectMessage = null
    this.setState({ selectedMessage: null })
  }

  selectMessageItem = (message: any, onComplete: Function) => {
    this.unselectMessage && this.unselectMessage()
    this.unselectMessage = onComplete
    this.setState({ selectedMessage: message })
  }

  renderBubble = (chatProps: any) => {
    return (
      <BubbleChatMessage
        bubbleProps={chatProps}
        selectMessageItem={this.selectMessageItem}
        unselectMessageItem={this.unselectMessageItem}
      />
    )
  }

  onPressSharedPostMessage = (postId: string) => {
    const { navigation } = this.props
    navigation.navigate(NAVIGATORS.POST_DETAILS.name, { id: postId })
  }

  onInputTextChanged = (text: string) => {
    if (isEmpty(text)) {
      return
    }
    const { emitIsTyping, chatRoomId, route } = this.props
    const roomId = get(route.params, 'chatRoomId', chatRoomId)
    emitIsTyping(true, roomId)
  }

  renderMessageText = (chatProps: any) => {
    const {
      currentMessage: { replyMessage },
    } = chatProps
    const { content, showContentTypeIcon, hasReply, iconName, contentType } =
      this.generateReplyMessageProps(replyMessage)

    let imageUrls = []
    if (hasReply && contentType === MESSAGE_TYPE.PHOTO) {
      imageUrls =
        replyMessage.image && replyMessage.image.map((item: any) => item.url)
    }

    return (
      <View style={styles.messageTextWrapper}>
        {hasReply && (
          <>
            <View style={styles.messageTextReplyWrapper}>
              <Text style={styles.messageTextReplyContent}>{content}</Text>

              {showContentTypeIcon && (
                <Icon
                  style={styles.replyFooterDescriptionType}
                  type={IconType.FontAwesome}
                  name={iconName}
                  color={COLORS.silver}
                  size={14}
                />
              )}
            </View>

            {contentType === MESSAGE_TYPE.PHOTO && (
              <ImageGallery
                images={imageUrls}
                containerStyle={styles.messageTextReplyImageGallery}
                paddingHorizontal={10}
              />
            )}
          </>
        )}

        <MessageText
          {...chatProps}
          wrapperStyle={{
            left: styles.messageTextMainLeft,
            right: styles.messageTextMainRight,
          }}
        />
      </View>
    )
  }

  renderMessageImage = ({ currentMessage: { image, sharedPost } }: any) => {
    if (isEmpty(image)) {
      return null
    }

    const images = image.map((item: any) => item.url)
    const sharedPostId = get(sharedPost, '_id')
    return (
      <ImageGallery
        images={images}
        containerStyle={styles.imageGallery}
        paddingHorizontal={10}
        onPress={
          !isEmpty(sharedPostId)
            ? () => this.onPressSharedPostMessage(sharedPostId)
            : undefined
        }
      />
    )
  }

  renderMessageAudio = (chatProps: any) => {
    const { currentMessage, position } = chatProps

    return (
      <AudioMessage
        message={currentMessage}
        position={position}
        playAudio={this.playAudio}
        stopAudio={this.stopAudio}
      />
    )
  }

  componentWillUnmount() {
    const { chatRoom, emitIsTyping } = this.props
    if (chatRoom) {
      emitIsTyping(false, chatRoom._id)
    }
  }

  onLoadEarlier = () => {
    const {
      pagination: { skip, endReached },
      getChatMessages,
      loading,
      chatRoom,
    } = this.props

    if (loading || endReached || !chatRoom) {
      return
    }

    getChatMessages(
      chatRoom._id,
      skip + DEFAULT_ITEMS_PER_PAGE,
      DEFAULT_ITEMS_PER_PAGE,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderAudioRecordInputToolbar = (props: any) => {
    return (
      <AudioRecordInputToolbar
        onFinishRecord={this.stopRecordAudio}
        onCancelRecord={this.cancelRecordAudio}
      />
    )
  }

  onReplyMessage = () => {
    const { chatRoom } = this.props

    let message = get(this.state, 'selectedMessage', null)
    if (isEmpty(message)) {
      this.unselectMessageItem()
      return
    }

    message.chatRoom = chatRoom._id
    this.setState({ isReplying: true, replyingMessage: { ...message } }, () => {
      this.unselectMessageItem()

      if (this.giftedChatRef) {
        this.giftedChatRef._messageContainerRef?.current?.scrollToOffset({
          offset: 0,
          animated: false,
        })
      }
    })
  }

  onDeleteMessage = () => {
    const { emitDeleteChatMessage, chatRoom } = this.props

    let message = get(this.state, 'selectedMessage', null)
    if (isEmpty(message)) {
      this.unselectMessageItem()
      return
    }

    message.chatRoom = chatRoom._id
    emitDeleteChatMessage && emitDeleteChatMessage(message)

    this.unselectMessageItem()
  }

  onCopyMessage = () => {
    const text = get(this.state, 'selectedMessage.text', '')
    Clipboard.setString(text)
    this.unselectMessageItem()
  }

  onForwardMessage = () => {
    const { navigation } = this.props
    navigation.navigate(NAVIGATORS.CHAT_PICKER.name, {
      from: NAVIGATORS.CHAT_ROOM,
    })
  }

  forwardMessageTo = (selectedChatRoom: any) => {
    const {
      selectedMessage: { text, audio, image, ...rest },
    } = this.state
    const { emitChatMessage } = this.props
    const attachments = audio ?? image
    const newMessage = {
      ...rest,
      text,
      attachments,
      chatRoom: selectedChatRoom._id,
    }
    emitChatMessage(newMessage)

    const { navigation } = this.props
    this.cleanAndGoBack()
    navigation.navigate(NAVIGATORS.CHAT_ROOM.name, {
      chatRoomId: selectedChatRoom._id,
    })
  }

  sharePost = (post: any) => {
    const { emitChatMessage, chatRoom } = this.props
    const newMessage = { sharedPost: post._id, chatRoom: chatRoom._id }

    emitChatMessage(newMessage)
  }

  renderNavigator = () => {
    const { navigation } = this.props
    const { targetUser, showRoomSubMenuHeader, selectedMessage } = this.state

    const backIcon = 'arrow-back'

    const title = get(targetUser, 'name', '')

    let chatRoomNavigatorStyles: Array<any> = [styles.chatRoomNavigator]
    let navigatorItemContainerStyles: Array<any> = [
      styles.navigatorItemContainer,
    ]
    let threeDotsVertical: Array<any> = [styles.threeDotsVertical]
    let threeDotsSubMenu: Array<any> = [styles.threeDotsSubMenu]
    if (Platform.OS === 'ios') {
      chatRoomNavigatorStyles.push(styles.chatRoomNavigatorIos)
      navigatorItemContainerStyles.push(styles.navigatorItemIos)
      threeDotsVertical.push(styles.threeDotsVerticalIos)
      threeDotsSubMenu.push(styles.threeDotsSubMenuIos)
    }

    return (
      <>
        <View style={chatRoomNavigatorStyles}>
          <View style={navigatorItemContainerStyles}>
            <TouchableOpacity
              style={styles.navigatorBackIcon}
              onPress={this.cleanAndGoBack}>
              <Icon
                type={IconType.MaterialIcons}
                name={backIcon}
                color={COLORS.black}
                size={26}
              />
            </TouchableOpacity>

            {isEmpty(selectedMessage) && (
              <Text style={styles.navigatorTitle}>
                {title || localizedStrings.chatRoom.defaultTitle}
              </Text>
            )}
          </View>

          <View style={styles.navigatorItemContainer}>
            {isEmpty(selectedMessage) && (
              <TouchableOpacity
                style={threeDotsVertical}
                onPress={() => {
                  this.setState((prevState) => ({
                    showRoomSubMenuHeader: !prevState.showRoomSubMenuHeader,
                  }))
                }}>
                <Icon
                  type={IconType.Entypo}
                  name={'dots-three-vertical'}
                  color={COLORS.black}
                  size={24}
                />
              </TouchableOpacity>
            )}

            {!isEmpty(selectedMessage) && (
              <>
                <TouchableOpacity
                  style={threeDotsVertical}
                  onPress={this.onReplyMessage}>
                  <Icon
                    type={IconType.Entypo}
                    name={'reply'}
                    color={COLORS.black}
                    size={24}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={threeDotsVertical}
                  onPress={this.onDeleteMessage}>
                  <Icon
                    type={IconType.MaterialIcons}
                    name={'delete'}
                    color={COLORS.black}
                    size={24}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={threeDotsVertical}
                  onPress={this.onCopyMessage}>
                  <Icon
                    type={IconType.MaterialIcons}
                    name={'content-copy'}
                    color={COLORS.black}
                    size={24}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={threeDotsVertical}
                  onPress={this.onForwardMessage}>
                  <Icon
                    type={IconType.Entypo}
                    name={'forward'}
                    color={COLORS.black}
                    size={24}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {!isEmpty(title) && showRoomSubMenuHeader && (
          <View style={threeDotsSubMenu}>
            <TouchableOpacity
              style={styles.threeDotsSubMenuItem}
              onPress={this.blockRoom}>
              <Text style={styles.threeDotsSubMenuItemText}>
                {localizedStrings.chatRoom.blockActionText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.threeDotsSubMenuItem}
              onPress={() => {
                this.setState({ showRoomSubMenuHeader: false })
                this.muteRoom()
              }}>
              <Text style={styles.threeDotsSubMenuItemText}>
                {localizedStrings.chatRoom.muteActionText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.threeDotsSubMenuItem}
              onPress={this.showConfirmationDelete}>
              <Text style={styles.threeDotsSubMenuItemText}>
                {localizedStrings.chatRoom.deleteActionText}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    )
  }

  render() {
    const {
      chatMessages,
      chatRoom,
      currentUser,
      isTyping,
      pagination: { endReached },
      error,
    } = this.props
    const errorMessage = get(error, 'response.data.error.message')
    if (!isEmpty(errorMessage)) {
      return (
        <View style={styles.errorView}>
          {this.renderNavigator()}
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )
    }

    if (isEmpty(chatRoom)) {
      return <View />
    }

    const { allowed = false, blocked = false } = chatRoom
    if (blocked) {
      this.cleanAndGoBack()
    }

    const {
      startAudio,
      playAudio,
      playAudioMessageId,
      cancelRecording,
      isReplying,
      showDeleteModal,
    } = this.state

    const chatExtraKeys = {
      allowed,
      startAudio,
      playAudio,
      playAudioMessageId,
      cancelRecording,
      isReplying,
    }

    return (
      <View style={styles.container}>
        <GiftedChat
          ref={(ref) => (this.giftedChatRef = ref)}
          messages={chatMessages}
          user={currentUser}
          placeholder={localizedStrings.chatRoom.composerInputPlaceholder}
          messagesContainerStyle={styles.giftChatContainer}
          textInputStyle={styles.composerInput}
          onSend={this.onSend}
          isTyping={isTyping}
          onInputTextChanged={this.debouncedOnInputTextChanged}
          onLoadEarlier={this.onLoadEarlier}
          loadEarlier={!endReached}
          infiniteScroll={!endReached}
          renderSend={this.renderSend}
          alwaysShowSend={true}
          onPressAvatar={this.pressAvatar}
          renderFooter={this.renderFooter}
          renderActions={!startAudio ? this.renderActions : undefined}
          renderMessageText={this.renderMessageText}
          renderBubble={this.renderBubble}
          renderMessageImage={this.renderMessageImage}
          renderMessageAudio={this.renderMessageAudio}
          renderInputToolbar={
            startAudio ? this.renderAudioRecordInputToolbar : undefined
          }
          extraData={chatExtraKeys}
        />

        {this.renderNavigator()}

        <Modal visible={showDeleteModal} transparent={true}>
          <View style={styles.deleteModalWrapper}>
            <View style={styles.deleteModal}>
              <Text style={styles.deleteModalTitle}>
                {localizedStrings.chatRoom.deleteWarningMessage}
              </Text>

              <View style={styles.deleteModalActionsView}>
                <DefaultButton
                  style={styles.deleteModalCancelAction}
                  onPress={this.hideConfirmationDelete}
                  text={localizedStrings.common.cancel}
                />

                <DefaultButton
                  style={styles.deleteModalConfirmAction}
                  styledColors={[COLORS.red, COLORS.red]}
                  onPress={this.deleteRoom}
                  text={localizedStrings.common.confirm}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column-reverse',
  },
  giftChatContainer: {
    backgroundColor: COLORS.white,
  },
  chatRoomNavigator: {
    width: '100%',
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.silver,
    zIndex: 1,
  },
  chatRoomNavigatorIos: {
    height: 60,
  },
  navigatorItemContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigatorItemIos: {
    marginTop: 0,
  },
  navigatorBackIcon: {
    marginLeft: 10,
    height: 54,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigatorTitle: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 18,
    fontWeight: '700',
  },
  composerInput: {
    marginHorizontal: 0,
  },
  composerActionsButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  composerSendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 17,
  },
  chatMessageRow: {
    flex: 1,
  },
  chatMessageRowBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.2,
  },
  chatMessageRowBackgroundSelected: {
    backgroundColor: COLORS.oceanGreen,
  },
  imageGallery: {
    width: 200,
    minHeight: 100,
    paddingTop: 10,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  warningRecordContainer: {
    margin: 0,
    height: 44,
    padding: 12,
    borderRadius: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningAudioRecordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    marginRight: 20,
  },
  warningLeftAudioRecordIcon: {
    width: 26,
    height: 26,
    padding: 0,
    backgroundColor: COLORS.white,
  },
  warningRecordAudioDuration: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 18,
    textAlign: 'justify',
    fontWeight: 'bold',
    marginRight: 20,
  },
  warningContainer: {
    margin: 10,
    height: 130,
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.darkGrey,
    flexDirection: 'row',
  },
  warningIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.easternBlue,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
  },
  warningContent: {
    flex: 1,
    marginLeft: 20,
    backgroundColor: 'transparent',
  },
  warningText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 18,
    textAlign: 'justify',
  },
  warningActionWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  warningActionButton: {
    marginRight: 14,
    borderRadius: 24,
    minWidth: 90,
  },
  customActionButton: {
    height: 47,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderRadius: 24,
  },
  blockActionText: {
    color: COLORS.darkRed,
    fontWeight: 'bold',
  },
  ignoreActionText: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  audioDurationTextInMessage: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'justify',
    marginRight: 10,
  },
  audioDurationLeftTextInMessage: {
    color: COLORS.regentGray,
  },
  recordMicrophoneButton: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 44,
    marginRight: 5,
    marginBottom: 3,
  },
  threeDotsVertical: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    marginRight: 10,
  },
  threeDotsVerticalIos: {
    marginTop: 0,
  },
  threeDotsSubMenu: {
    position: 'absolute',
    top: 54,
    right: 10,
    height: 144,
    width: 140,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 4 },
    zIndex: 1,
  },
  threeDotsSubMenuIos: {
    top: 60,
  },
  threeDotsSubMenuItem: {
    position: 'relative',
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    zIndex: 2,
  },
  threeDotsSubMenuItemText: {
    fontSize: 15,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
  },

  messageTextWrapper: {
    paddingVertical: 5,
  },
  messageTextMainRight: {
    color: COLORS.white,
  },
  messageTextMainLeft: {
    color: COLORS.black,
  },
  messageTextReplyWrapper: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.silver,
    paddingLeft: 5,
    marginHorizontal: 10,
    marginTop: 5,
    alignItems: 'center',
  },
  messageTextReplyImageGallery: {
    width: 150,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.silver,
    paddingTop: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  messageTextReplyContent: {
    paddingLeft: 5,
    color: COLORS.silver,
  },

  scrollBottomButton: {
    display: 'none',
  },

  replyFooterContainer: {
    height: 60,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.iron,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyFooterCancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 44,
  },
  replyFooterContentWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  replyFooterTitle: {
    fontSize: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontWeight: '700',
    color: COLORS.midGray,
  },
  replyFooterDescriptionWrapper: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  replyFooterDescriptionText: {
    fontSize: 13,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.silver,
  },
  replyFooterDescriptionType: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.silver,
    marginHorizontal: 5,
  },

  deleteModalWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModal: {
    width: '70%',
    height: 150,
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  deleteModalTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.doveGray,
    padding: 20,
  },
  deleteModalActionsView: {
    height: 44,
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  deleteModalCancelAction: {
    flex: 1,
  },
  deleteModalConfirmAction: {
    marginLeft: 20,
    flex: 1,
  },
  errorView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 20,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    color: COLORS.doveGray,
    marginTop: 50,
  },
})

export default ChatRoom

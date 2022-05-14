import React from 'react'
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'
import { FONT_FAMILIES } from 'constants/fonts'
import localizedStrings from 'localization'
import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { isEmpty } from 'lodash'
import { DEFAULT_BUTTON_HIT_SLOP } from 'constants'

export interface CommentInputProps extends TextInputProps {
  containerStyle?: ViewStyle
  onSendButtonPress: (text: string) => void
  inputRef: any
  initialText: string | null
  replyingTo: string | null
  editingComment: boolean | null
  onCancelReplying: () => void
  onCancelEditing: () => void
}

interface State {
  showEmojiSelectorModal: boolean
  text: string
}

class CommentInput extends React.PureComponent<CommentInputProps, State> {
  private inputRef: any
  constructor(props: CommentInputProps) {
    super(props)

    this.state = {
      showEmojiSelectorModal: false,
      text: props.initialText || '',
    }

    this.inputRef = React.createRef()
  }

  componentDidUpdate(prevProps: Readonly<CommentInputProps>) {
    if (
      this.props.initialText &&
      prevProps.initialText !== this.props.initialText
    ) {
      this.setState({ text: this.props.initialText })
    }
  }

  onEmojiButtonPress = () => {
    this.setState({
      showEmojiSelectorModal: true,
    })
  }

  onEmojiSelected = (emoji: string) => {
    this.setState((prevState) => ({
      text: prevState.text + emoji,
      showEmojiSelectorModal: false,
    }))
  }

  onInputTextChanged = (text: string) => {
    this.setState({
      text,
    })
  }

  hideEmojiSelectorModal = () => {
    this.setState({
      showEmojiSelectorModal: false,
    })
  }

  onEmojiContainerStart = () => {
    this.hideEmojiSelectorModal()
    return true
  }

  onSendButtonPress = () => {
    if (isEmpty(this.state.text)) {
      return
    }
    this.inputRef.blur()
    this.props.onSendButtonPress(this.state.text.trim())
    this.setState({
      text: '',
    })
  }

  setRef = (ref: any) => {
    this.inputRef = ref
    this.props.inputRef(ref)
  }

  onCancelReplyingButtonPress = () => {
    this.props.onCancelReplying()
  }

  onCancelEditingButtonPress = () => {
    this.props.onCancelEditing()
  }

  renderReplying = (username: string) => {
    return (
      <View style={styles.replyingContainer}>
        <Text style={styles.replyingTo}>
          {localizedStrings.postDetails.replyingTo}
        </Text>
        <Text style={styles.replyingToUsername}>{username}</Text>
        <Text style={styles.replyingToSeparator}>-</Text>
        <TouchableOpacity
          style={styles.cancelReplyingButton}
          hitSlop={DEFAULT_BUTTON_HIT_SLOP}
          onPress={this.onCancelReplyingButtonPress}>
          <Text style={styles.cancelReplyingButtonText}>
            {localizedStrings.common.cancel}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderEditing = () => {
    return (
      <View style={styles.replyingContainer}>
        <Text style={styles.replyingTo}>
          {localizedStrings.postDetails.editingComment}
        </Text>
        <TouchableOpacity
          style={styles.cancelReplyingButton}
          hitSlop={DEFAULT_BUTTON_HIT_SLOP}
          onPress={this.onCancelEditingButtonPress}>
          <Text style={styles.cancelReplyingButtonText}>
            {localizedStrings.common.cancel}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { containerStyle, style, replyingTo, editingComment, ...rest } = this.props
    const { showEmojiSelectorModal, text } = this.state
    return (
      <Animated.View style={[styles.container, containerStyle]}>
        {replyingTo !== undefined &&
          replyingTo !== null &&
          replyingTo !== '' &&
          this.renderReplying(replyingTo)}
        {editingComment && this.renderEditing()}
        <View style={styles.content}>
          <TouchableOpacity
            hitSlop={{ top: 7, right: 7, bottom: 7, left: 7 }}
            style={styles.emojiButton}
            onPress={this.onEmojiButtonPress}>
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={'emoticon-excited-outline'}
              color={COLORS.silver}
              size={25}
            />
          </TouchableOpacity>
          <TextInput
            ref={this.setRef}
            style={[styles.input, style]}
            multiline={true}
            placeholder={localizedStrings.postDetails.commentInputPlaceholder}
            value={text}
            onChangeText={this.onInputTextChanged}
            {...rest}
          />
          <TouchableOpacity
            hitSlop={{ top: 7, right: 7, bottom: 7, left: 7 }}
            style={styles.sendButton}
            onPress={this.onSendButtonPress}>
            <Icon
              type={IconType.MaterialIcons}
              name={'send'}
              color={COLORS.cornFlowerBlue}
              size={25}
            />
          </TouchableOpacity>
          <Modal
            visible={showEmojiSelectorModal}
            transparent={true}
            onRequestClose={this.hideEmojiSelectorModal}>
            <View
              style={styles.emojiSelectorModalContainer}
              onStartShouldSetResponder={this.onEmojiContainerStart}>
              <View style={styles.emojiSelectorModalContent}>
                <EmojiSelector
                  category={Categories.all}
                  onEmojiSelected={this.onEmojiSelected}
                />
              </View>
            </View>
          </Modal>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
  },
  input: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    flex: 1,
    color: COLORS.black,
    paddingVertical: 5,
  },
  emojiButton: {
    marginHorizontal: 16,
  },
  sendButton: {
    marginHorizontal: 16,
  },
  emojiSelectorModalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  emojiSelectorModalContent: {
    backgroundColor: COLORS.white,
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingTop: 20,
  },
  replyingContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  replyingTo: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
  },
  replyingToUsername: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    fontWeight: '600',
  },
  replyingToSeparator: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    marginHorizontal: 5,
  },
  cancelReplyingButton: {},
  cancelReplyingButtonText: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 12,
    color: COLORS.silver,
    fontWeight: '600',
  },
})

export default CommentInput

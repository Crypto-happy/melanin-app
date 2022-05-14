import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Bubble } from 'react-native-gifted-chat'
import COLORS from 'constants/colors'
import { get, isEmpty } from 'lodash'

interface Props {
  bubbleProps: any
  selectMessageItem: (message: any, onComplete: Function) => void
  unselectMessageItem: () => void
}

interface State {
  message: any
  selected: boolean
}

class BubbleChatMessage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    const {
      bubbleProps: { currentMessage },
    } = props

    this.state = {
      message: currentMessage,
      selected: false,
    }
  }

  onUnselectPress = () => {
    const { unselectMessageItem } = this.props
    unselectMessageItem && unselectMessageItem()
  }

  onLongPress = () => {
    const { selectMessageItem, unselectMessageItem } = this.props
    const { selected, message } = this.state

    if (selected) {
      unselectMessageItem && unselectMessageItem()
      return
    }

    this.setState({ selected: !selected })

    selectMessageItem &&
      selectMessageItem(message, () =>
        this.setState((prevState) => ({ selected: !prevState })),
      )
  }

  render() {
    const { bubbleProps } = this.props
    const { selected } = this.state

    let rowStyles: Array<any> = [styles.messageRowBackground]
    if (selected) {
      rowStyles.push(styles.rowSelected)
    }

    const { position } = bubbleProps
    let messageRowButtonStyles: any[] = [styles.messageRowButton]
    let avatarButtonStyles: any[] = [styles.avatarButton]
    let onPressAvatar = () => {}
    const currentMessageUserId = get(bubbleProps, 'currentMessage.user._id', '')
    const nextMessageUserId = get(bubbleProps, 'nextMessage.user._id', '')

    if (
      position === 'left' &&
      !isEmpty(currentMessageUserId) &&
      (currentMessageUserId !== nextMessageUserId || isEmpty(nextMessageUserId))
    ) {
      messageRowButtonStyles.push({ left: 45 })
      avatarButtonStyles.push({ left: 0 })
      onPressAvatar = () =>
        bubbleProps.onPressAvatar(bubbleProps.currentMessage.user)
    }

    return (
      <>
        <View style={rowStyles} />

        <TouchableOpacity
          style={avatarButtonStyles}
          onPress={onPressAvatar}
          onLongPress={this.onLongPress}
        />

        <TouchableOpacity
          style={messageRowButtonStyles}
          onPress={this.onUnselectPress}
          onLongPress={this.onLongPress}
        />

        <Bubble
          {...bubbleProps}
          onLongPress={this.onLongPress}
          wrapperStyle={{
            left: {
              backgroundColor: COLORS.iron,
            },
            right: {
              backgroundColor: COLORS.cornFlowerBlue,
            },
          }}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  messageRowButton: {
    position: 'absolute',
    top: 0,
    left: -5,
    width: '100%',
    height: '100%',
  },
  avatarButton: {
    position: 'absolute',
    top: 0,
    left: -50,
    width: 50,
    height: '100%',
  },
  messageRowBackground: {
    position: 'absolute',
    width: '120%',
    height: '100%',
    top: 0,
    left: -60,
    bottom: 0,
    right: 0,
    opacity: 0.2,
  },
  rowSelected: {
    backgroundColor: COLORS.oceanGreen,
  },
})

export default BubbleChatMessage

import React from 'react'
import {
  Modal,
  ModalProps,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Platform,
} from 'react-native'
import COLORS from 'constants/colors'
import localizedStrings from 'localization'
import { FONT_FAMILIES } from 'constants/fonts'
import { DefaultButton } from 'components/DefaultButton'

export interface SharePostModalProps extends ModalProps {
  onSharePress: (text: string) => void
  onOverlayPress: () => void
}

interface State {
  text: string
  showingKeyboard: boolean
}

class SharePostModal extends React.PureComponent<SharePostModalProps, State> {
  private keyboardDidShowListener: any
  private keyboardDidHideListener: any

  constructor(props: SharePostModalProps) {
    super(props)

    this.state = {
      text: '',
      showingKeyboard: false,
    }
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = () => {
    this.setState({ showingKeyboard: true })
  }

  _keyboardDidHide = () => {
    this.setState({ showingKeyboard: false })
  }

  onTextChange = (text: string) => {
    this.setState({
      text,
    })
  }

  onSharePress = () => {
    const { text } = this.state

    this.props.onSharePress(text)
    this.setState({ text: '' })
  }

  render() {
    const { onOverlayPress, ...rest } = this.props
    const { text, showingKeyboard } = this.state

    let containerStyles: Array<any> = [styles.container]
    let contentStyles: Array<any> = [styles.content]
    if (Platform.OS === 'ios') {
      let _style

      if (showingKeyboard) {
        _style = styles.containerTop
        contentStyles.push(styles.contentTop)
      } else {
        _style = styles.containerCenter
      }

      containerStyles.push(_style)
    } else {
      containerStyles.push(styles.containerCenter)
    }

    return (
      <Modal {...rest} onRequestClose={onOverlayPress}>
        <TouchableWithoutFeedback
          onPress={onOverlayPress}
          style={styles.touchable}>
          <View style={containerStyles}>
            <View style={contentStyles}>
              <Text style={styles.title}>
                {localizedStrings.shareModal.title}
              </Text>

              <TextInput
                style={styles.input}
                numberOfLines={5}
                placeholder={localizedStrings.shareModal.inputPlaceHolder}
                multiline={true}
                value={text}
                onChangeText={this.onTextChange}
              />

              <DefaultButton
                text={localizedStrings.shareModal.share}
                onPress={this.onSharePress}
                contentContainerStyle={styles.shareButton}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'stretch',
  },
  containerCenter: {
    justifyContent: 'center',
  },
  containerTop: {
    justifyContent: 'flex-start',
  },
  content: {
    backgroundColor: COLORS.white,
    marginHorizontal: 27,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 5,
    shadowRadius: 5,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: COLORS.black,
    shadowOpacity: 0.5,
    elevation: 2,
    overflow: 'hidden',
  },
  contentTop: {
    marginTop: 50,
  },
  title: {
    paddingVertical: 14,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    height: 200,
    textAlignVertical: 'top',
    padding: 10,
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 15,
    backgroundColor: COLORS.lightSilver,
  },
  shareButton: {
    marginVertical: 10,
    marginHorizontal: '10%',
  },
})

export default SharePostModal

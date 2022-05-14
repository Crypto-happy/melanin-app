import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import COLORS from 'constants/colors'
import { secondsToHms } from 'utils/time.utils'
import { FONT_FAMILIES } from 'constants/fonts'
import { head, isEmpty } from 'lodash'

interface Props {
  message: any
  position: string
  playAudio: (audio: any, messageId: string, onComplete: Function) => void
  stopAudio: () => void
}

interface State {
  isPlaying: boolean
}

class AudioMessage extends React.PureComponent<Props, State> {
  state = {
    isPlaying: false,
  }

  getAudio = () => {
    const { audio } = this.props.message
    return head(audio)
  }

  togglePlayer = () => {
    const { isPlaying } = this.state
    const { message, playAudio, stopAudio } = this.props
    const audio: any = this.getAudio()

    if (isPlaying) {
      stopAudio && stopAudio()
    } else {
      const onComplete = () => this.setState({ isPlaying: false })
      playAudio && playAudio(audio, message._id, onComplete)
    }

    this.setState({ isPlaying: !isPlaying })
  }

  render() {
    const { position } = this.props
    const { isPlaying } = this.state

    const audio: any = this.getAudio()
    if (isEmpty(audio)) {
      return null
    }

    let messageStyles: Array<any> = [styles.recordIcon]
    let textMessStyles: Array<any> = [styles.durationTextInMessage]
    const isYourMessage = position === 'right'

    if (!isYourMessage) {
      messageStyles.push(styles.leftAudioRecordIcon)
      textMessStyles.push(styles.durationLeftTextInMessage)
    }

    return (
      <View style={styles.wrapper}>
        <TouchableOpacity style={messageStyles} onPress={this.togglePlayer}>
          <Icon
            type={IconType.AntDesign}
            name={isPlaying ? 'pausecircle' : 'play'}
            color={isYourMessage ? COLORS.white : COLORS.easternBlue}
            size={26}
          />
        </TouchableOpacity>

        <Text style={textMessStyles}>{secondsToHms(audio.duration)}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  recordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    marginRight: 20,
  },
  leftAudioRecordIcon: {
    width: 26,
    height: 26,
    padding: 0,
    backgroundColor: COLORS.white,
  },
  durationTextInMessage: {
    fontFamily: FONT_FAMILIES.MONTSERRAT_MEDIUM,
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'justify',
    marginRight: 10,
  },
  durationLeftTextInMessage: {
    color: COLORS.regentGray,
  },
})

export default AudioMessage

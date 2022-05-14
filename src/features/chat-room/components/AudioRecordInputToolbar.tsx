import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
  PanResponderInstance,
} from 'react-native'
import COLORS from '../../../constants/colors'
import Icon from '../../../components/Icon'
import { IconType } from '../../../components/Icon/Icon'
import localizedStrings from 'localization'
import { secondsToHms } from '../../../utils/time.utils'

interface Props {
  onFinishRecord: () => void
  onCancelRecord: () => void
}

interface State {
  duration: number
  // panResponder: PanResponderInstance
}

class AudioRecordInputToolbar extends React.PureComponent<Props, State> {
  static defaultProps = {
    onFinishRecord: () => {},
    onCancelRecord: () => {},
  }

  timer: number
  pan: Animated.ValueXY
  panResponder: PanResponderInstance

  constructor(props: Props) {
    super(props)

    this.pan = new Animated.ValueXY()
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        this.pan.setOffset({
          x: this.pan.x._value,
          y: this.pan.y._value,
        })
      },
      onPanResponderMove: (e, gestureState) => {
        // Custom logic here
        if (this.pan.x._value < -139) {
          const { onCancelRecord } = this.props
          onCancelRecord && onCancelRecord()
        }

        Animated.event([
          null,
          {
            dx: this.pan.x,
          },
        ])(e, gestureState) // <<--- INVOKING HERE!
      },
      onPanResponderRelease: () => {
        this.pan.setValue({
          x: 0,
          y: this.pan.y._value,
        })
      },
    })

    this.timer = 0
    this.state = {
      duration: 0,
    }
  }

  componentDidMount() {
    this.startTimer()
  }

  countUp = () => {
    this.setState((prevState) => ({ duration: prevState.duration + 1 }))
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countUp, 1000)
    }
  }

  render() {
    const { onFinishRecord } = this.props

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.audioRecordButton}
          onPress={onFinishRecord}>
          <Icon
            type={IconType.Entypo}
            name="controller-record"
            color={COLORS.red}
            size={18}
          />

          <Text style={styles.durationText}>
            {secondsToHms(this.state.duration)}
          </Text>
        </TouchableOpacity>

        <View style={styles.cancelSection}>
          <Text style={styles.cancelText}>
            {localizedStrings.chatRoom.cancelRecordingAudioText}
          </Text>

          <Animated.View
            style={{
              transform: [
                { translateX: this.pan.x },
                { translateY: this.pan.y },
              ],
            }}
            {...this.panResponder.panHandlers}>
            <Icon
              type={IconType.Feather}
              name="mic"
              color={COLORS.oceanGreen}
              size={20}
            />
          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  audioRecordIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.easternBlue,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    marginRight: 20,
  },
  durationText: {
    marginLeft: 10,
  },
  cancelSection: {
    flexDirection: 'row',
  },
  cancelText: {
    color: COLORS.silver,
    marginRight: 10,
  },
})

export default AudioRecordInputToolbar

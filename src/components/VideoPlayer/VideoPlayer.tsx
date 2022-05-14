import React from 'react'
import Video, { VideoProperties } from 'react-native-video'
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls/src'
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import COLORS from 'constants/colors'
import Icon from 'components/Icon'
import { IconType } from 'components/Icon/Icon'
import AutoHeightImage from 'components/AutoHeightImage'

export interface VideoPlayerProps extends VideoProperties {
  containerStyle?: ViewStyle
  isViewable: boolean
  previewUrl: string
  width: number
  shouldResumeOnViewable?: boolean
  shouldShowPreview?: boolean
}

interface State {
  paused: boolean
  currentTime: number
  duration: number
  isFullscreen: boolean
  muted: boolean
  loading: boolean
  firstTime: boolean
}

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

class VideoPlayer extends React.PureComponent<VideoPlayerProps, State> {
  private videoPlayer: any

  constructor(props: VideoPlayerProps) {
    super(props)

    this.state = {
      paused: true,
      currentTime: 0,
      duration: 0,
      isFullscreen: false,
      muted: false,
      loading: false,
      firstTime: true,
    }

    this.videoPlayer = React.createRef()
  }

  componentDidUpdate(prevProps: VideoPlayerProps) {
    if (
      !this.props.isViewable &&
      prevProps.isViewable !== this.props.isViewable &&
      !this.state.isFullscreen
    ) {
      this.setState({
        paused: true,
      })
    }

    if (
      this.props.isViewable &&
      prevProps.isViewable !== this.props.isViewable &&
      !this.state.isFullscreen &&
      this.props.shouldResumeOnViewable
    ) {
      this.setState({
        paused: false,
      })
    }
  }

  onProgress = ({ currentTime }) => {
    const { onProgress } = this.props
    this.setState(
      {
        currentTime: Math.round(currentTime),
      },
      () => {
        onProgress && onProgress(currentTime)
      },
    )
  }

  onLoad = ({ duration }) => {
    this.videoPlayer.seek(this.state.currentTime)
    this.setState({
      duration: Math.round(duration),
      loading: false,
    })
  }

  onReplay = () => {
    this.setState(
      {
        paused: true,
      },
      () => {
        this.videoPlayer.seek(0)
        this.setState({
          paused: false,
          currentTime: 0,
        })
      },
    )
  }

  onTogglePaused = () => {
    this.setState((prevState: State) => ({
      paused: !prevState.paused,
    }))
  }

  onSeek = (currentTime: number) => {
    this.setState(
      {
        currentTime,
      },
      () => {
        this.videoPlayer.seek(currentTime)
      },
    )
  }

  onSeeking = () => {}

  onFullscreen = () => {
    this.setState(
      (prevState) => ({
        isFullscreen: !prevState.isFullscreen,
      }),
      () => {
        this.videoPlayer.seek(this.state.currentTime)
      },
    )
  }

  onMuteButtonPress = () => {
    this.setState((prevState) => ({
      muted: !prevState.muted,
    }))
  }

  onLoadStart = () => {
    this.setState({
      loading: true,
    })
  }

  onBackButtonPress = () => {
    if (this.state.isFullscreen) {
      this.setState({
        isFullscreen: false,
      })
      return true
    }
    return false
  }

  onPreviewButtonPress = () => {
    this.setState({
      firstTime: false,
      paused: false,
    })
  }

  renderPreview = () => {
    const { previewUrl, width = SCREEN_WIDTH } = this.props
    return (
      <View style={styles.container}>
        <AutoHeightImage
          width={width}
          source={{ uri: previewUrl }}
          resizeMode={'cover'}
        />
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewPlayButton}
            onPress={this.onPreviewButtonPress}>
            <Icon
              type={IconType.AntDesign}
              name={'play'}
              color={COLORS.white}
              size={50}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderContent = () => {
    const {
      style,
      isViewable,
      videoRef,
      shouldShowPreview = true,
      ...rest
    } = this.props
    const restProps = { ...rest }
    if (restProps.hasOwnProperty('onProgress')) {
      delete restProps.onProgress
    }

    const {
      paused,
      currentTime,
      duration,
      isFullscreen,
      muted,
      loading,
      firstTime,
    } = this.state

    let playerState = paused ? PLAYER_STATES.PAUSED : PLAYER_STATES.PLAYING
    if (Math.round(currentTime) === Math.round(duration)) {
      playerState = PLAYER_STATES.ENDED
    }

    if (firstTime && shouldShowPreview) {
      return this.renderPreview()
    }

    return (
      <>
        <Video
          ref={(ref) => {
            this.videoPlayer = ref
            videoRef && videoRef(ref)
          }}
          resizeMode={'cover'}
          paused={paused}
          onLoad={this.onLoad}
          onProgress={this.onProgress}
          style={isFullscreen ? styles.video : style}
          muted={muted}
          preferredForwardBufferDuration={10000}
          bufferConfig={{ minBufferMs: 5000 }}
          useTextureView={false}
          onLoadStart={this.onLoadStart}
          {...restProps}
        />
        <MediaControls
          fadeOutDelay={2000}
          duration={duration}
          isFullScreen={false}
          isLoading={loading}
          mainColor={COLORS.oceanGreen}
          onPaused={this.onTogglePaused}
          onReplay={this.onReplay}
          onSeek={this.onSeek}
          onSeeking={this.onSeeking}
          progress={currentTime}
          playerState={playerState}
          onMutePress={this.onMuteButtonPress}
          isMute={muted}
          onFullScreen={this.onFullscreen}
        />
      </>
    )
  }

  closeFullscreen = () => {
    this.setState({
      isFullscreen: false,
    })
  }

  render() {
    const { containerStyle } = this.props
    const { isFullscreen } = this.state

    if (isFullscreen) {
      return (
        <Modal transparent={true} onRequestClose={this.closeFullscreen}>
          <View style={styles.modalContainer}>{this.renderContent()}</View>
        </Modal>
      )
    }
    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderContent()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
  },
  modalContainer: {
    backgroundColor: COLORS.black,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  video: {
    width: '100%',
    aspectRatio: 1,
  },
  muteButton: {},
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlayButton: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
})

export default VideoPlayer

import React from 'react'
import RootNavigator from './RootNavigator'
import { LoadingIndicatorContainer } from '../features/loading'
import { connect } from 'react-redux'
import {
  connectToSocketRequest,
  disconnectSocketRequest,
  getUnreadsRequest,
} from 'sagas/actions'
import { AppState } from 'react-native'

class NavigatorWrapper extends React.Component<any> {
  private appState: any

  constructor(props: any) {
    super(props)

    this.appState = AppState.currentState
  }

  handleAppStateChange = (nextAppState: string) => {
    const {
      socketConnected,
      connectToSocket,
      disconnectSocket,
      getUnreads,
      token,
    } = this.props
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (!socketConnected && token) {
        connectToSocket()
        getUnreads()
      }
    }

    if (
      this.appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      if (socketConnected) {
        disconnectSocket()
      }
    }

    this.appState = nextAppState
  }

  componentDidMount() {
    const { socketConnected, connectToSocket, token } = this.props
    if (!socketConnected && token) {
      connectToSocket()
    }
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  render() {
    return (
      <>
        <RootNavigator />
        <LoadingIndicatorContainer />
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  socketConnected: state.socket.connected,
  token: state.auth.token,
})

const mapDispatchToProps = (dispatch: any) => ({
  connectToSocket: () => dispatch(connectToSocketRequest()),
  disconnectSocket: () => dispatch(disconnectSocketRequest()),
  getUnreads: () => dispatch(getUnreadsRequest()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorWrapper)

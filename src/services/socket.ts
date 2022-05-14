import io from 'socket.io-client'
import Config from 'react-native-config'
import { getState } from 'store/root-store'

class Socket {
  private static instance: any

  private constructor() {}

  static getInstance = () => {
    if (!Socket.instance || Socket.instance.disconnected) {
      Socket.instance = io(Config.SOCKET_URL, {
        query: {
          token: getState().auth.token,
        },
        transports: ['websocket'],
        jsonp: false,
      })

      Socket.instance.on('connect', function () {
        console.log('Socket connected')
      })

      Socket.instance.connect()
    }
    return Socket.instance
  }
}

export default Socket

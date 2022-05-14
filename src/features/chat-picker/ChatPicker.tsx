import { prop } from 'lodash/fp'
import React from 'react'
import { ChatScreen } from '../chat'

interface Props {
  route: any
  navigation: any
  chatRooms: any[]
  loading: boolean
  pagination: any
  error: any
  getChatRooms: (skip: number, limit: number, searchText?: string) => void
  currentUser: any
}

interface State {
  isSearching: boolean
  searchText: string
}

class ChatPicker extends React.Component<Props, State> {

  render() {
    return (
      <ChatScreen {...this.props} chatRoomDidSelect={this.chatRoomDidSelect}/>
    )
  }

  chatRoomDidSelect = (chatRoom: any) => {
    const { navigation, route } = this.props
    navigation.navigate(route.params.from.name, { selectedChatRoom: chatRoom });
  }
}

export default ChatPicker

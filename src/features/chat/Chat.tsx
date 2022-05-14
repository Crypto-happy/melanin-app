import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import ChatRoomItem from 'features/chat/components/ChatRoomItem'
import COLORS from 'constants/colors'
import { NAVIGATORS } from 'constants/navigators'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import { getChatScreenOptions } from './navigation-options'

interface Props {
  navigation: any
  chatRooms: any[]
  loading: boolean
  pagination: any
  error: any
  getChatRooms: (skip: number, limit: number, searchText?: string) => void
  currentUser: any
  chatRoomDidSelect: (chatRoom: any) => void
  markChatRoomIdRead: (chatRoomId: string, read: number) => void
}

interface State {
  isSearching: boolean
  searchText: string
}

class Chat extends React.Component<Props, State> {
  focusListenerUnsubscribe: any

  state = {
    isSearching: false,
    searchText: '',
  }

  componentDidMount() {
    const { getChatRooms, navigation } = this.props
    const { searchText, isSearching } = this.state

    this.props.navigation.addListener('blur', this._onBlur)

    getChatRooms(0, DEFAULT_ITEMS_PER_PAGE)
    // this.focusListenerUnsubscribe = navigation.addListener(
    //   'focus',
    //   this.onFocus,
    // )

    navigation.setOptions(
      getChatScreenOptions({
        pressOnSearch: this.showSearchBox,
        isSearching: isSearching,
        searchText: searchText,
        onSearchTextChanged: this.onSearchTextChanged,
      }),
    )
  }

  _onBlur = () => {
    const { navigation } = this.props
    this.setState({ isSearching: false, searchText: '' })

    navigation.setOptions(
      getChatScreenOptions({
        pressOnSearch: this.showSearchBox,
        isSearching: false,
        searchText: '',
        onSearchTextChanged: this.onSearchTextChanged,
      }),
    )
  }

  filterChatRoomByText = () => {
    const { navigation, getChatRooms } = this.props
    const { searchText } = this.state

    getChatRooms(0, DEFAULT_ITEMS_PER_PAGE, searchText)

    this.setState(
      (prevState) => ({ isSearching: !prevState.isSearching }),
      () => {
        navigation.setOptions(
          getChatScreenOptions({
            pressOnSearch: this.showSearchBox,
            isSearching: this.state.isSearching,
            searchText: searchText,
            onSearchTextChanged: this.onSearchTextChanged,
          }),
        )
      },
    )
  }

  showSearchBox = () => {
    const { navigation } = this.props

    this.setState(
      (prevState) => ({ isSearching: !prevState.isSearching }),
      () => {
        navigation.setOptions(
          getChatScreenOptions({
            pressOnSearch: this.filterChatRoomByText,
            isSearching: this.state.isSearching,
            searchText: this.state.searchText,
            onSearchTextChanged: this.onSearchTextChanged,
          }),
        )
      },
    )
  }

  onSearchTextChanged = (text: string) => {
    this.setState({ searchText: text })
  }

  onListEndReached = () => {
    const {
      pagination: { skip, endReached },
      getChatRooms,
      loading,
    } = this.props

    if (loading || endReached) {
      return
    }

    getChatRooms(skip + DEFAULT_ITEMS_PER_PAGE, DEFAULT_ITEMS_PER_PAGE)
  }

  onFocus = () => {
    this.props.getChatRooms(0, DEFAULT_ITEMS_PER_PAGE)
  }

  renderItem = ({ item, index }: any) => {
    const { currentUser } = this.props

    return (
      <ChatRoomItem
        data={item}
        index={index}
        onItemPress={this.onItemPress}
        currentUser={currentUser}
      />
    )
  }

  onItemPress = (index: number) => {
    const { chatRooms, navigation, chatRoomDidSelect, markChatRoomIdRead } =
      this.props

    const chatRoom = chatRooms[index]
    if (chatRoomDidSelect) {
      chatRoomDidSelect(chatRoom)
    } else {
      const { _id: chatRoomId, unread } = chatRoom
      markChatRoomIdRead(chatRoomId, unread)
      navigation.navigate(NAVIGATORS.CHAT_ROOM.name, {
        chatRoomId,
      })
    }
  }

  keyExtractor = (chatRoom: any) => {
    return chatRoom._id
  }

  render() {
    const { chatRooms = [] } = this.props

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.listRoomWrapper}
          data={chatRooms}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.7}
          onEndReached={this.onListEndReached}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  listRoomWrapper: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
})

export default Chat

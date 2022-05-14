import { connect } from 'react-redux'
import Chat from './Chat'
import { Dispatch } from 'redux'
import { getChatRoomsRequest, markChatRoomRead } from './ducks/actions'
import { chatRoomsSelector } from 'features/chat/ducks/selectors'

const mapStateToProps = (state: any) => ({
  chatRooms: chatRoomsSelector(state),
  loading: state.chat.loading,
  pagination: state.chat.pagination,
  error: state.chat.error,
  currentUser: state.auth.currentUser,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getChatRooms: (skip: number, limit: number, searchText: string) =>
    dispatch(getChatRoomsRequest(skip, limit, searchText)),
  markChatRoomIdRead: (id: string, read: number) =>
    dispatch(markChatRoomRead(id, read)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)

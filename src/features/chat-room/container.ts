import { connect } from 'react-redux'
import ChatRoom from './ChatRoom'
import { compose, Dispatch } from 'redux'
import {
  allowChatRoom,
  blockChatRoom,
  createChatRoomRequest,
  deleteChatRoom,
  emitAudioMessage,
  emitChatMessage,
  emitDeleteChatMessage,
  emitImagesMessage,
  emitIsTyping,
  getChatMessagesRequest,
  muteChatRoom,
  getChatRoomOfMessageRequest,
  deleteChatRoomSuccess,
} from './ducks/actions'
import {
  chatMessagesSelector,
  chatRoomSelector,
  getSharedPost,
} from 'features/chat-room/ducks/selectors'
import withCustomHeader from 'components/HOCs/withCustomHeader'

const mapStateToProps = (state: any, ownProps: any) => {
  const { loading, pagination, error, isTyping } = state.chatRoom
  return {
    chatMessages: chatMessagesSelector(state),
    loading,
    pagination,
    error,
    currentUser: state.auth.currentUser,
    chatRoom: chatRoomSelector(state, ownProps),
    sharedPost: getSharedPost(state, ownProps),
    isTyping,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getChatMessages: (chatRoomId: string, skip: number, limit: number) =>
    dispatch(getChatMessagesRequest(chatRoomId, skip, limit)),
  emitChatMessage: (chatMessage: any) => dispatch(emitChatMessage(chatMessage)),
  emitDeleteChatMessage: (chatMessage: any) =>
    dispatch(emitDeleteChatMessage(chatMessage)),
  createChatRoom: (userId: string) => dispatch(createChatRoomRequest(userId)),
  emitIsTyping: (isTyping: boolean, chatRoomId: string) =>
    dispatch(emitIsTyping(isTyping, chatRoomId)),
  emitImagesMessage: (attachments: any[], chatRoomId: string) =>
    dispatch(emitImagesMessage(attachments, chatRoomId)),
  putBlockChatRoom: (chatRoomId: string) => dispatch(blockChatRoom(chatRoomId)),
  putAllowChatRoom: (chatRoomId: string) => dispatch(allowChatRoom(chatRoomId)),
  putMuteChatRoom: (chatRoomId: string) => dispatch(muteChatRoom(chatRoomId)),
  putDeleteChatRoom: (chatRoomId: string) =>
    dispatch(deleteChatRoom(chatRoomId)),
  emitAudioMessage: (audio: any, chatRoomId: string) =>
    dispatch(emitAudioMessage(audio, chatRoomId)),
  getChatRoomOfMessage: (messageId: string) =>
    dispatch(getChatRoomOfMessageRequest(messageId)),
  clearChatMessagesCache: () => dispatch(deleteChatRoomSuccess('')),
})

const headerOptions = {
  showBackButton: true,
  showLogo: false,
}

export default compose(
  withCustomHeader(headerOptions),
  connect(mapStateToProps, mapDispatchToProps),
)(ChatRoom)

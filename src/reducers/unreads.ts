import createReducer from 'utils/createReducer'
import { GET_UNREADS_SUCCESS } from 'sagas/action-types'
import update from 'immutability-helper'
import { MARK_CHAT_ROOM_READ } from '../features/chat/ducks/action-types'

const initialState = {
  chat: 0,
}

const handleGetUnreadsSuccess = (state: any, action: any) => {
  const { chat: chatUnreads = 0 } = action.payload.result

  return update(state, {
    chat: { $set: chatUnreads },
  })
}

const markChatRoomReadSuccess = (state: any, action: any) => {
  const { read = 0 } = action.payload
  const { chat } = state
  const result = chat - read
  return update(state, {
    chat: { $set: result < 0 ? 0 : result },
  })
}

const unreadsReducer = createReducer(initialState, {
  [GET_UNREADS_SUCCESS]: handleGetUnreadsSuccess,
  [MARK_CHAT_ROOM_READ]: markChatRoomReadSuccess,
})

export default unreadsReducer

import createReducer from 'utils/createReducer'
import {
  SOCKET_CONNECT_FAILURE,
  SOCKET_CONNECT_REQUEST,
  SOCKET_CONNECT_SUCCESS,
  SOCKET_DISCONNECT_REQUEST,
} from 'sagas/action-types'
import update from 'immutability-helper'

const initialState = {
  connected: false,
  error: null,
}

const handleConnectToSocketRequest = (state: any, action: any) => {
  return update(state, {
    connected: { $set: false },
    error: { $set: null },
  })
}

const handleConnectToSocketSuccess = (state: any, action: any) => {
  return update(state, {
    connected: { $set: true },
    error: { $set: null },
  })
}

const handleConnectToSocketFailure = (state: any, action: any) => {
  return update(state, {
    connected: { $set: false },
    // error: { $set: action.payload.error },
  })
}

const handleSocketDisconnectRequest = (state: any, action: any) => {
  return update(state, {
    connected: { $set: false },
  })
}

const socketReducer = createReducer(initialState, {
  [SOCKET_CONNECT_REQUEST]: handleConnectToSocketRequest,
  [SOCKET_CONNECT_SUCCESS]: handleConnectToSocketSuccess,
  [SOCKET_CONNECT_FAILURE]: handleConnectToSocketFailure,
  [SOCKET_DISCONNECT_REQUEST]: handleSocketDisconnectRequest,
})

export default socketReducer

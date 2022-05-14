import createReducer from '../utils/createReducer'
import { LOGIN_SUCCESS } from '../features/login/ducks/action-types'
import update from 'immutability-helper'
import { RESET_FOR_LOGOUT } from './action-types'
import { SESSION_EXPIRED } from '../sagas/action-types'
import { LOGOUT_SUCCESS } from '../features/settings/ducks/action-types'
import { FOLLOW_TOPICS_SUCCESS } from 'features/follow-topics/ducks/action-types'
import { FOLLOW_USER_BY_ID_SUCCESS } from 'features/followers-following/ducks/action-types'
import { CHANGE_PASSWORD_SUCCESS } from 'features/change-password/ducks/action-types'

const initialState = {
  isLoggedIn: false,
  token: null,
  currentUser: null,
}

const updateAuthToken = (state: any, action: any) => {
  const {
    result: { token },
  } = action.payload

  return update(state, {
    token: { $set: token },
  })
}

const handleLoginSuccess = (state: any, action: any) => {
  const {
    result: { user, token },
  } = action.payload

  return update(state, {
    isLoggedIn: { $set: true },
    token: { $set: token },
    currentUser: { $set: user },
  })
}

const resetForLogout = () => {
  return initialState
}

const handleSessionExpired = (state: any, action: any) => {
  return initialState
}

const handleLogoutSuccess = (state: any, action: any) => {
  return initialState
}

const handleFollowTopicsSuccess = (state: any, action: any) => {
  return update(state, {
    currentUser: {
      followedTopics: {
        $set: action.payload.result,
      },
    },
  })
}

const handleFollowUserSuccess = (state, action) => {
  const user = action.payload.result.user
  return update(state, {
    currentUser: {
      followings: { $set: user.followings },
      followingsCount: { $set: user.followings.length },
    },
  })
}

const authReducer = createReducer(initialState, {
  [LOGIN_SUCCESS]: handleLoginSuccess,
  [CHANGE_PASSWORD_SUCCESS]: updateAuthToken,
  [RESET_FOR_LOGOUT]: resetForLogout,
  [LOGOUT_SUCCESS]: handleLogoutSuccess,
  [SESSION_EXPIRED]: handleSessionExpired,
  [FOLLOW_TOPICS_SUCCESS]: handleFollowTopicsSuccess,
  [FOLLOW_USER_BY_ID_SUCCESS]: handleFollowUserSuccess,
})

export default authReducer

import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  dynamicLink: null,
}

const handleSetDynamicLink = (state: any, action: { payload: any }) => {
  return update(state, {
    dynamicLink: { $set: action.payload },
  })
}

const navigatorReducer = createReducer(initialState, {
  [ActionTypes.SET_DYNAMIC_LINK]: handleSetDynamicLink,
})

export default navigatorReducer

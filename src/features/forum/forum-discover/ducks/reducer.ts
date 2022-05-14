import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'

const initialState = {
  forumPosts: {},
}

const getForumPostsSuccess = (
  state: any,
  { payload: { id, forumPosts } }: any,
) => update(state, { forumPosts: { [id]: { $set: forumPosts } } })

const forumDiscoverReducer = createReducer(initialState, {
  [ActionTypes.GET_FORUM_POSTS_SUCCESS]: getForumPostsSuccess,
})

export default forumDiscoverReducer

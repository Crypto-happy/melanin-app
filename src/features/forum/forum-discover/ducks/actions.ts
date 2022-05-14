import * as ActionTypes from './action-types'

export const getForumPostRequest = (
  id: string,
  limit?: number,
  skip?: number,
) => ({
  type: ActionTypes.GET_FORUM_POSTS_REQUEST,
  payload: {
    id,
    limit,
    skip,
  },
})

export const getForumPostSuccess = (id: string, forumPosts: any[]) => ({
  type: ActionTypes.GET_FORUM_POSTS_SUCCESS,
  payload: {
    id,
    forumPosts,
  },
})

export const getForumPostFailure = (error: any) => ({
  type: ActionTypes.GET_FORUM_POSTS_FAILURE,
  payload: {
    error,
  },
})

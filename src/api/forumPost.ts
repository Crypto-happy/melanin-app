import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import apiInstance from './base'

export const createForumPost = async (forumPost: any) => {
  return apiInstance.post('/forumPosts', forumPost)
}

export const getForumPosts = (
  id: string,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  skip: number = 0,
) => {
  return apiInstance.get(`categories/${id}/forumPosts`, {
    params: {
      skip,
      limit,
    },
  })
}

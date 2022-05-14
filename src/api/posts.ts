import apiInstance from './base'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const getPosts = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  search: string = '',
) => {
  return apiInstance.get('posts', {
    params: {
      skip,
      limit,
      search,
      sortBy: 'createdAt:desc',
    },
  })
}

export const getPostsByUserId = async (
  authorId: string = '',
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.get(`users/${authorId}/posts`, {
    params: {
      skip,
      limit,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const likePost = async (id: string) => {
  return apiInstance.post(`posts/${id}/like`)
}

export const dislikePost = async (id: string) => {
  return apiInstance.post(`posts/${id}/dislike`)
}

export const ratePost = async (id: string, rating: number) => {
  return apiInstance.post(`posts/${id}/rate`, {
    rating,
  })
}

export const reportPost = async (id: string, reason: number) => {
  return apiInstance.post(`posts/${id}/report`, {
    reason,
  })
}

export const createPost = async (post: any) => {
  return apiInstance.post('posts', post)
}

export const getPost = async (id: string) => {
  return apiInstance.get(`posts/${id}`)
}

export const sharePost = async (id: string, text: string) => {
  return apiInstance.post(`posts/${id}/share`, {
    text,
  })
}

export const shareExternalPost = async (id: string) => {
  return apiInstance.post(`posts/${id}/shareExternal`)
}

export const getPostComments = async (
  postId: string,
  skip: number,
  limit: number,
) => {
  return apiInstance.get(`posts/${postId}/comments`, {
    params: {
      skip,
      limit,
    },
  })
}

export const updatePost = async (post: any) => {
  return apiInstance.put(`posts/${post.id}`, {
    ...post,
  })
}

export const deletePost = async (id: string) => {
  return apiInstance.delete(`posts/${id}`)
}

export const getProductCategories = async () => {
  return apiInstance.get('product_categories')
}

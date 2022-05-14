import apiInstance from './base'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const getCustomerReviews = async () => {
  return apiInstance.get('users/insights/customer_reviews')
}

export const getProfileStats = async (dropdown: string = 'months') => {
  return apiInstance.get('users/insights/profile_stats', {
    params: {
      dropdown,
    },
  })
}

export const getPageInteractions = async (dropdown: string = 'months') => {
  return apiInstance.get('/interactions', {
    params: {
      dropdown,
    },
  })
}

export const getTopPosts = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  type: string = 'photo',
) => {
  return apiInstance.get('users/insights/top_posts', {
    params: {
      skip,
      limit,
      type,
      sortBy: 'viewsCount:desc',
    },
  })
}

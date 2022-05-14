import apiInstance from './base'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const getUserList = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  search: string = '',
  sortBy: string = ''
) => {
  return apiInstance.get('users/list', {
    params: {
      search,
      sortBy,
      limit,
      skip,
    },
  })
}

export const suggestedUserList = async (
  search: string = '',
  selectedTab: string = '',
  sortBy: string = '',
) => {
  return apiInstance.get(`${selectedTab}/suggest`, {
    params: {
      search,
      sortBy
    },
  })
}

import apiInstance from './base'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const getDirectoriesBySearchRequest = async (
  searchText: string = '',
  locationText: string = '',
  filterMin: number = 1,
  filterMax: number = 5,
  highViewOnly: boolean = false,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.post(
    `business-directory/search?skip=${skip}&limit=${limit}`,
    {
      searchText,
      locationText,
      filterMin,
      filterMax,
      highViewOnly,
    },
  )
}

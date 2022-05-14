import apiInstance from './base'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const getAllProducts = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.post(`products/all`, {
    params: {
      skip,
      limit,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const getProductCategories = async () => {
  return apiInstance.get('product_categories')
}

export const getSearchProductsByCategory = async (
  category: string,
) => {
  return apiInstance.post(`products/category`, { category })
}

export const getFeaturedProducts = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.post(`products/featuredList`, {
    params: {
      skip,
      limit,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const getFiveStarProducts = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.post(`products/5Star`, {
    params: {
      skip,
      limit,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const getNewArrivalProducts = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.post(`products/newArrival`, {
    params: {
      skip,
      limit,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const getSearchProductsByText = async (
  query: string,
  type: int
) => {
  return apiInstance.post(`products/search`, { query, type })
}
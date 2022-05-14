import apiInstance from './base'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const fetchRecommendedProfiles = async (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => {
  return apiInstance.get(`explore/fetchRecommendedProfiles/${userId}`, {
    params: {
      skip,
      limit,
      filterMin,
      filterMax,
      sortBy: 'ratingAvg:desc',
    },
  })
}

export const fetchFeaturedVideos = async (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => {
  return apiInstance.get(`explore/fetchFeaturedVideos/${userId}`, {
    params: {
      skip,
      limit,
      filterMin,
      filterMax,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const fetchFeaturedPhotos = async (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => {
  return apiInstance.get(`explore/fetchFeaturedPhotos/${userId}`, {
    params: {
      skip,
      limit,
      filterMin,
      filterMax,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const fetchTopRatedBusinesses = async (
  userId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  filterMin: number = 0,
  filterMax: number = 5,
) => {
  return apiInstance.get(`explore/fetchTopRatedBusinesses/${userId}`, {
    params: {
      skip,
      limit,
      filterMin,
      filterMax,
      sortBy: 'ratingAvg:desc',
    },
  })
}

export const fetchCommunityPosts = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  search: string = '',
) => {
  return apiInstance.get('explore/community', {
    params: {
      skip,
      limit,
      search,
      sortBy: 'createdAt:desc',
    },
  })
}

export const fetchFollows = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.get('explore/follow', {
    params: { skip, limit },
  })
}

export const fetchTopProfiles = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  profileTypes: Array<string> = [],
  filterMin: number = 0,
  filterMax: number = 5,
) => {
  return apiInstance.get('explore/profile', {
    params: {
      skip,
      limit,
      profileTypes,
      filterMin,
      filterMax,
    },
  })
}

export const fetchMedias = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.get('explore/medias', {
    params: {
      skip,
      limit,
    },
  })
}

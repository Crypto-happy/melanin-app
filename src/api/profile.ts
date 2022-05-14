import apiInstance from './base'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

export const getMyProfile = async () => {
  return apiInstance.get(`users/me`)
}

export const updateMyProfile = async (newProfile: any) => {
  return apiInstance.put(`users/me`, newProfile)
}

export const getUserProfile = async (userId: string) => {
  return apiInstance.get(`users/${userId}`)
}

export const getUserFollowers = async (userId: string) => {
  return apiInstance.get(`users/${userId}/followers`)
}

export const getUserFollowings = async (userId: string) => {
  return apiInstance.get(`users/${userId}/followings`)
}

export const followUserById = async (userId: string) => {
  return apiInstance.post('users/follow', {
    id: userId,
  })
}

export const fetchReviewsById = async (
  targetId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.get(`reviews/${targetId}`, {
    params: {
      skip,
      limit,
      sortBy: 'updatedAt:desc',
    },
  })
}

export const postNewReview = async (
  targetId: string,
  text: string,
  rating: number,
) => {
  return apiInstance.post(`reviews`, {
    text,
    rating,
    targetId,
  })
}

export const getUserSettingMe = async () => {
  return apiInstance.get(`users/me`)
}

export const updateUserSetting = async (settingObj: object) => {
  return apiInstance.put(`users/me/settings`, settingObj)
}

export const gotBlockedUser = async () => {
  return apiInstance.get(`users/me/blocked_users`)
}

export const getUserRatingPosts = async (userId: string) => {
  return apiInstance.get(`users/${userId}/rating_posts`)
}

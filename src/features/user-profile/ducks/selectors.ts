import { createSelector } from 'reselect'
import {
  getAttachmentsEntities,
  getPostEntities,
  getUserEntities,
  transformEntities,
} from '../../../selectors/entities'

const getUserProfile = (state: any, userId: string) => state.userProfile[userId]

const getPostIds = (state: any, userId: string) =>
  state.userProfile[userId].postIds

const getUserInfo = (state: any, userId: string) =>
  state.userProfile[userId].userInfo

export const userInfoSelector = createSelector(getUserInfo, (user) => user)

export const postsProfileSelector = createSelector(
  getPostIds,
  getPostEntities,
  getUserEntities,
  getAttachmentsEntities,
  transformEntities,
)

export const subscriptionCountSelector = createSelector(
  [getUserProfile],
  (profile) => {
    return {
      postsCount: profile.postsCount,
      followersCount: profile.followersCount,
      followingsCount: profile.followingsCount,
      reviewsCount: profile.reviewsCount,
      ratingTotalPoints: profile.ratingTotalPoints,
      ratingTotalPosts: profile.ratingTotalPosts,
    }
  },
)

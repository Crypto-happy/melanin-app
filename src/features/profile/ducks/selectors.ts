import { createSelector } from 'reselect'
import {
  getAttachmentsEntities,
  getPostEntities,
  getUserEntities,
  transformEntities,
} from 'selectors/entities'

const getProfile = (state: any) => state.profile

const getPostIds = (state: any) => state.profile.postIds

const getAuthUser = (state: any) => state.profile.userInfo

export const authProfileSelector = createSelector(getAuthUser, (user) => user)

export const postsProfileSelector = createSelector(
  getPostIds,
  getPostEntities,
  getUserEntities,
  getAttachmentsEntities,
  transformEntities,
)

export const subscriptionCountSelector = createSelector(
  [getProfile],
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

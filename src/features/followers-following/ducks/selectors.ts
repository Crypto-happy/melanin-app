import { createSelector } from 'reselect'
import { getUserEntities } from 'selectors/entities'

const getFollowerFolling = (state: any) => state.followerFollowing

const followerIdsSelector = createSelector(
  [getFollowerFolling],
  (followerFollowing: any) => followerFollowing.followerIds,
)

const followingIdsSelector = createSelector(
  [getFollowerFolling],
  (followerFollowing: any) => followerFollowing.followingIds,
)

const transformUser = (userIds: Array<string>, users: any) => {
  return userIds.map((userId) => users[userId])
}

export const followersSelector = createSelector(
  [followerIdsSelector, getUserEntities],
  transformUser,
)

export const followingsSelector = createSelector(
  [followingIdsSelector, getUserEntities],
  transformUser,
)

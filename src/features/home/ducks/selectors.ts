import { createSelector } from 'reselect'
import {
  getAttachmentsEntities,
  getPostEntities,
  getUserEntities,
  transformEntities,
} from 'selectors/entities'

const getPostIds = (state) => state.home.postIds

export const postsSelector = createSelector(
  getPostIds,
  getPostEntities,
  getUserEntities,
  getAttachmentsEntities,
  transformEntities,
)

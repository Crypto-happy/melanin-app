import { createSelector } from 'reselect'
import {
  getAttachmentsEntities,
  getPostEntities,
  getUserEntities,
  transformEntities,
} from 'selectors/entities'

const getPostIds = (state:any) => state.insights.postIds

export const topPostsSelector = createSelector(
  getPostIds,
  getPostEntities,
  getUserEntities,
  getAttachmentsEntities,
  transformEntities,
)

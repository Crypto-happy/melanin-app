import { createSelector } from 'reselect'
import {
  getAttachmentsEntities,
  getPostEntities,
  getUserEntities,
  transformEntities,
} from 'selectors/entities'

const getsearchPostIds = (state) => state.search.postIds

export const searchSelector = createSelector(
  getsearchPostIds,
  getPostEntities,
  getUserEntities,
  getAttachmentsEntities,
  transformEntities,
)

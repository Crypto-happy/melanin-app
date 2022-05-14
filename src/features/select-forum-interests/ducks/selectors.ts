import { createSelector } from 'reselect'
import { cloneDeep, includes } from 'lodash'

const getForumCategories = (state: any) => state.forumInterests.categories
const getSelectedForumCategoryIds = (state: any) =>
  state.forumInterests.selectedCategoryIds

const getSelectedForumCategories = (categories: any, selectedIds: string[]) => {
  let selectedCategories = cloneDeep(categories)
  return selectedCategories.filter(({ _id: id }: any) =>
    includes(selectedIds, id),
  )
}

export const selectedForumInterestCategoriesSelector = createSelector(
  [getForumCategories, getSelectedForumCategoryIds],
  getSelectedForumCategories,
)

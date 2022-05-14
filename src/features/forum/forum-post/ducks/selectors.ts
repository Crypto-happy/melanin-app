import { createSelector } from 'reselect'
import { isEmpty, values } from 'lodash'

const getCategoryByIds = (state: any) => state.entities.categories
const getSubCategoryByIds = (state: any) => state.entities.subCategories

const getForumFormSelectedCategoryId = (state: any) =>
  state.forumForm.selectedCategoryId

export const getCategoryArraySelector = createSelector(
  [getCategoryByIds],
  values,
)

export const getCategoryByIdSelector = createSelector(
  [getForumFormSelectedCategoryId, getCategoryByIds],
  (id, categoryByIds) => categoryByIds[id] || {},
)

export const getSubCategoryArraySelector = createSelector(
  [getCategoryByIdSelector, getSubCategoryByIds],
  (category, subCategoryByIds) => {
    if (isEmpty(category)) {
      return []
    }

    return category.subCategories.map((id: string) => subCategoryByIds[id])
  },
)

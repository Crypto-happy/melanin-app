import { DEFAULT_ITEMS_PER_PAGE } from '../constants'

export const getNewPagination = (oldPagination: any, data: any[]) => {
  const { skip } = oldPagination
  const endReached = data.length < DEFAULT_ITEMS_PER_PAGE

  return {
    skip: data.length > 0 ? skip + DEFAULT_ITEMS_PER_PAGE : skip,
    endReached,
  }
}

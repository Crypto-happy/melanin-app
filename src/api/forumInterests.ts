import apiInstance from './base'

export const getForumInterestCategories = async () => {
  return await apiInstance.get('/categories/with_sub_categories')
}

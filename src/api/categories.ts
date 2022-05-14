import apiInstance from './base'

export const fetchAllCategory = async () => {
  return apiInstance.get('categories/with_sub_categories')
}

export const fetchCategories = async () => {
  return apiInstance.get('categories')
}

export const fetchSubCategories = async (categoryId: string) => {
  return apiInstance.get(`categories/${categoryId}/with_sub_categories`)
}

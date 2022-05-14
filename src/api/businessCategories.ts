import apiInstance from './base'

export const getBusinessCategories = async () => {
  return apiInstance.get('business_categories')
}

export const selectBusinessCategory = async (category: string) => {
  return apiInstance.post('business_categories/select', {
    category,
  })
}

import apiInstance from './base'

export const getCountries = async () => {
  return apiInstance.get('region/countries')
}

export const getStates = async (countryId: number) => {
  return apiInstance.get(`region/${countryId}/states`)
}

export const getCities = async (stateId: number) => {
  return apiInstance.get(`region/${stateId}/cities`)
}

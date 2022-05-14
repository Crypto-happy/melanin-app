import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { get, sortBy } from 'lodash'

const initialState = {
  loading: false,
  success: false,
  error: false,
  newProfile: {},
  countries: [],
  states: [],
  cities: [],
}

const resetToDefault = () => {
  return initialState
}

const handleUpdateProfileRequest = (state: any) => {
  return update(state, {
    loading: { $set: true },
    success: { $set: false },
    error: { $set: false },
  })
}

const handleUpdateProfileSuccess = (state: any, action: any) => {
  const newProfileResult = get(action, 'payload.results', {})

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    newProfile: { $set: newProfileResult },
  })
}

const handleUpdateProfileFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handlegetCountriesRequest = (state: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: false },
  })
}

const US_INDEX = 235
const handleGetCountrySuccess = (state: any, action: any) => {
  let countries = get(action, 'payload.results', [])
  const usa = countries.splice(US_INDEX, 1)[0]
  countries.unshift(usa)

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    countries: { $set: countries },
  })
}

const handleGetCountryFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handlegetStatesRequest = (state: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: false },
  })
}

const handleGetStateSuccess = (state: any, action: any) => {
  const states = get(action, 'payload.results', [])

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    states: { $set: sortBy(states, ['name']) },
  })
}

const handleGetStateFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handlegetCitiesRequest = (state: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: false },
  })
}

const handleGetCitySuccess = (state: any, action: any) => {
  const cities = get(action, 'payload.results', {})

  return update(state, {
    loading: { $set: false },
    success: { $set: true },
    error: { $set: false },
    cities: { $set: cities },
  })
}

const handleGetCityFailure = (state: any, action: any) => {
  return update(state, {
    loading: { $set: false },
    success: { $set: false },
    error: { $set: action.payload.error },
  })
}

const editProfileReducer = createReducer(initialState, {
  [ActionTypes.RESET_EDIT_PROFILE]: resetToDefault,
  [ActionTypes.EDIT_PROFILE_UPDATE_PROFILE_REQUEST]: handleUpdateProfileRequest,
  [ActionTypes.EDIT_PROFILE_UPDATE_PROFILE_SUCCESS]: handleUpdateProfileSuccess,
  [ActionTypes.EDIT_PROFILE_UPDATE_PROFILE_FAILURE]: handleUpdateProfileFailure,
  [ActionTypes.EDIT_PROFILE_GET_COUNTRY_REQUEST]: handlegetCountriesRequest,
  [ActionTypes.EDIT_PROFILE_GET_COUNTRY_SUCCESS]: handleGetCountrySuccess,
  [ActionTypes.EDIT_PROFILE_GET_COUNTRY_FAILURE]: handleGetCountryFailure,
  [ActionTypes.EDIT_PROFILE_GET_STATE_REQUEST]: handlegetStatesRequest,
  [ActionTypes.EDIT_PROFILE_GET_STATE_SUCCESS]: handleGetStateSuccess,
  [ActionTypes.EDIT_PROFILE_GET_STATE_FAILURE]: handleGetStateFailure,
  [ActionTypes.EDIT_PROFILE_GET_CITY_REQUEST]: handlegetCitiesRequest,
  [ActionTypes.EDIT_PROFILE_GET_CITY_SUCCESS]: handleGetCitySuccess,
  [ActionTypes.EDIT_PROFILE_GET_CITY_FAILURE]: handleGetCityFailure,
})

export default editProfileReducer

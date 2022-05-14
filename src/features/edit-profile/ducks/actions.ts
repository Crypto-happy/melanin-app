import * as ActionTypes from './action-types'
import * as AuthActionTypes from 'reducers/action-types'

export const resetEditProfile = () => ({
  type: ActionTypes.RESET_EDIT_PROFILE,
  showLoading: false,
})

export const resetForLogout = () => ({
  type: AuthActionTypes.RESET_FOR_LOGOUT,
  showLoading: false,
})

export const updateProfileRequest = (
  newInfo: any,
  attachment: any,
  uploadProgressHandler: (event: ProgressEvent) => void,
) => ({
  type: ActionTypes.EDIT_PROFILE_UPDATE_PROFILE_REQUEST,
  payload: { newInfo, attachment, uploadProgressHandler },
  showLoading: true,
})

export const updateProfileSuccess = (results: any) => ({
  type: ActionTypes.EDIT_PROFILE_UPDATE_PROFILE_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const updateProfileFailure = (error: any) => ({
  type: ActionTypes.EDIT_PROFILE_UPDATE_PROFILE_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getCountriesRequest = () => ({
  type: ActionTypes.EDIT_PROFILE_GET_COUNTRY_REQUEST,
  payload: {},
  showLoading: false,
})

export const getCountrySuccess = (results: any) => ({
  type: ActionTypes.EDIT_PROFILE_GET_COUNTRY_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const getCountryFailure = (error: any) => ({
  type: ActionTypes.EDIT_PROFILE_GET_COUNTRY_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getStatesRequest = (countryId: number) => ({
  type: ActionTypes.EDIT_PROFILE_GET_STATE_REQUEST,
  payload: { countryId },
  showLoading: false,
})

export const getStateSuccess = (results: any) => ({
  type: ActionTypes.EDIT_PROFILE_GET_STATE_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const getStateFailure = (error: any) => ({
  type: ActionTypes.EDIT_PROFILE_GET_STATE_FAILURE,
  payload: { error },
  showLoading: false,
})

export const getCitiesRequest = (stateId: number) => ({
  type: ActionTypes.EDIT_PROFILE_GET_CITY_REQUEST,
  payload: { stateId },
  showLoading: true,
})

export const getCitySuccess = (results: any) => ({
  type: ActionTypes.EDIT_PROFILE_GET_CITY_SUCCESS,
  payload: { results },
  showLoading: false,
})

export const getCityFailure = (error: any) => ({
  type: ActionTypes.EDIT_PROFILE_GET_CITY_FAILURE,
  payload: { error },
  showLoading: false,
})

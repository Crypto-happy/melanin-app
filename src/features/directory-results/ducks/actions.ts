import * as ActionTypes from './action-types'

export const getDirectoriesBySearchRequest = (
  searchRequest: any,
  skip: number,
  limit: number,
) => ({
  type: ActionTypes.GET_DIRECTORIES_BY_SEARCH_REQUEST,
  payload: { searchRequest, skip, limit },
  showLoading: true,
})

export const getDirectoriesBySearchSuccess = (result: any) => {
  return {
    type: ActionTypes.GET_DIRECTORIES_BY_SEARCH_SUCCESS,
    payload: { result },
    showLoading: false,
  }
}

export const getDirectoriesBySearchFailure = (error: any) => ({
  type: ActionTypes.GET_DIRECTORIES_BY_SEARCH_FAILURE,
  payload: { error },
  showLoading: false,
})

export const resetDirectorySearchResult = () => ({
  type: ActionTypes.RESET_DIRECTORIES_SEARCH_RESULT,
  payload: {},
  showLoading: false,
})

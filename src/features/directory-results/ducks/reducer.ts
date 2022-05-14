import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { isEmpty, get, reduce } from 'lodash'

import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const initialState = {
  directoryIds: [],
  directories: {},
  pagination: {
    skip: 0,
    endReached: false,
  },
  loading: false,
  error: null,
}

const handleGetDirectoriesRequest = (state: any, action: any) => {
  const { skip } = action.payload

  return update(state, {
    loading: {
      $set: true,
    },
    error: {
      $set: null,
    },
    pagination: {
      skip: {
        $set: skip,
      },
    },
  })
}

const handleGetDirectoriesSuccess = (state: any, action: any) => {
  const payloadDirectories = get(action, 'payload.result', [])

  const { ids, directories } = reduce(
    payloadDirectories,
    (result: any, directory: any) => {
      const { _id } = directory
      result.ids.push(_id)
      result.directories[_id] = directory

      return result
    },
    {
      ids: [],
      directories: {},
    },
  )

  return update(state, {
    loading: {
      $set: false,
    },
    error: {
      $set: null,
    },
    directoryIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    directories: { $merge: directories },
    pagination: {
      endReached: {
        $set: ids.length < DEFAULT_ITEMS_PER_PAGE,
      },
    },
  })
}

const handleGetDirectoriesFailure = (state: any, action: any) => {
  return update(state, {
    loading: {
      $set: false,
    },
    error: {
      $set: action.payload.error,
    },
  })
}

const handleResetDirectorySearchResult = (state: any, action: any) => {
  return initialState
}

const directoryResultsReducer = createReducer(initialState, {
  [ActionTypes.GET_DIRECTORIES_BY_SEARCH_REQUEST]: handleGetDirectoriesRequest,
  [ActionTypes.GET_DIRECTORIES_BY_SEARCH_SUCCESS]: handleGetDirectoriesSuccess,
  [ActionTypes.GET_DIRECTORIES_BY_SEARCH_FAILURE]: handleGetDirectoriesFailure,
  [ActionTypes.RESET_DIRECTORIES_SEARCH_RESULT]: handleResetDirectorySearchResult,
})

export default directoryResultsReducer

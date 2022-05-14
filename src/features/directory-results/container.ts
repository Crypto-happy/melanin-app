import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import DirectoryResults from './DirectoryResults'
import {
  getDirectoriesBySearchRequest,
  resetDirectorySearchResult,
} from './ducks/actions'

const mapStateToProps = (state: any) => {
  const {
    loading,
    error,
    directoryIds,
    directories,
    pagination,
  } = state.directoryResults

  return {
    loading,
    error,
    directoryIds,
    directories,
    pagination,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getDirectories: (searchRequest: any, skip: number, limit: number) =>
    dispatch(getDirectoriesBySearchRequest(searchRequest, skip, limit)),
  resetOldSearchResult: () => dispatch(resetDirectorySearchResult()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryResults)

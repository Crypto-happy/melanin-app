import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import EditProfile from './EditProfile'
import {
  updateProfileRequest,
  getCountriesRequest,
  getStatesRequest,
  getCitiesRequest,
  resetForLogout,
  resetEditProfile,
} from './ducks/actions'

const mapStateToProps = (state: any) => {
  const {
    loading,
    success,
    error,
    countries,
    states,
    cities,
  } = state.editProfile
  const { subCategories } = state.entities

  return {
    loading,
    success,
    error,
    subCategoriesById: subCategories,
    countries,
    states,
    cities,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateProfile: (
    newInfo: any,
    attachment: any,
    uploadProgressHandler: (event: ProgressEvent) => void,
  ) =>
    dispatch(updateProfileRequest(newInfo, attachment, uploadProgressHandler)),
  removeAuth: () => dispatch(resetForLogout()),
  reset: () => dispatch(resetEditProfile()),
  getCountries: () => dispatch(getCountriesRequest()),
  getStates: (countryId: number) => dispatch(getStatesRequest(countryId)),
  getCities: (stateId: number) => dispatch(getCitiesRequest(stateId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)

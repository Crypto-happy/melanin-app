import { connect } from 'react-redux'
import TopProfiles from './TopProfiles'
import * as Actions from './ducks/actions'
import { Dispatch } from 'redux'

const mapStateToProps = (state: any) => ({
  authUser: state.auth.currentUser,

  loading: state.topProfiles.loading,
  pagination: state.topProfiles.pagination,
  profiles: state.topProfiles.profiles,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getTopProfiles: (profileType: string, skip: number = 0) =>
    dispatch(Actions.recommendedTopProfiles(profileType, skip)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopProfiles)

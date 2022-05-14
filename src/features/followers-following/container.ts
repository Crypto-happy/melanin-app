import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import FollowerFollowing from './FollowerFollowing'
import * as Actions from './ducks/actions'
import { followersSelector, followingsSelector } from './ducks/selectors'

const mapStateToProps = (state: any) => ({
  authUser: state.auth.currentUser,
  followers: followersSelector(state),
  followings: followingsSelector(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetDefault: () => dispatch(Actions.resetFollowerFollowing()),
  getFollowersByUser: (userId: string) =>
    dispatch(Actions.getFollowersRequest(userId)),
  getFollowingsByUser: (userId: string) =>
    dispatch(Actions.getFollowingsRequest(userId)),
  followUser: (userId: string) => dispatch(Actions.followUser(userId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowerFollowing)

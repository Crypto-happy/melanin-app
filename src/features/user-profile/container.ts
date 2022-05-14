import { shareExternalPostRequest } from './../post-details/ducks/actions'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { get, isEmpty } from 'lodash'

import UserProfile from './UserProfile'
import {
  postsProfileSelector,
  subscriptionCountSelector,
  userInfoSelector,
} from './ducks/selectors'
import {
  followUserRequest,
  getPostsByAuthorIdRequest,
  getUserProfileRequest,
  getUserProfileRatingPostRequest,
} from './ducks/actions'
import { postsSelector } from '../home/ducks/selectors'
import { topPostsSelector } from '../insights/ducks/selectors'
import {
  dislikePostRequest,
  likePostRequest,
  ratePostRequest,
} from '../home/ducks/actions'
import { getProfileRequest } from '../profile/ducks/actions'
import { sharePostRequest } from 'features/post-details/ducks/actions'

const mapStateToProps = (state: any, props: any) => {
  let userId = get(props, 'route.params.userId', 'initProfile')
  if (isEmpty(state.userProfile[userId])) {
    userId = 'initProfile'
  }

  return {
    userInfo: userInfoSelector(state, userId),
    posts: postsProfileSelector(state, userId),
    postsSecond: postsSelector(state),
    topPosts: topPostsSelector(state),
    ...subscriptionCountSelector(state, userId),
    loading: state.userProfile[userId].loading,
    pagination: state.userProfile[userId].pagination,
    currentUser: state.auth.currentUser,
    authUserFollowings: get(state, 'profile.userInfo.followings', []),
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getProfile: (userId?: string) => dispatch(getUserProfileRequest(userId)),
  getRatingPosts: (userId: string) =>
    dispatch(getUserProfileRatingPostRequest(userId)),
  getAuthProfile: () => dispatch(getProfileRequest()),
  getPosts: (id: string, skip: number, limit: number) =>
    dispatch(getPostsByAuthorIdRequest(id, skip, limit)),
  ratePost: (id: string, rating: number) =>
    dispatch(ratePostRequest(id, rating)),
  likePost: (id: string) => dispatch(likePostRequest(id)),
  dislikePost: (id: string) => dispatch(dislikePostRequest(id)),
  followUser: (userId: string) => dispatch(followUserRequest(userId)),
  sharePost: (id: string, text: string) => dispatch(sharePostRequest(id, text)),
  shareExternalPost: (id: string) => dispatch(shareExternalPostRequest(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)

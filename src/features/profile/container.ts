import { shareExternalPostRequest } from './../post-details/ducks/actions'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Profile from './Profile'
import {
  authProfileSelector,
  postsProfileSelector,
  subscriptionCountSelector,
} from './ducks/selectors'
import {
  getProfileRequest,
  getPostsByAuthorIdRequest,
  getProfileRatingPostRequest,
  getAllCategoryRequest,
} from './ducks/actions'
import { postsSelector } from '../home/ducks/selectors'
import {
  deletePostRequest,
  dislikePostRequest,
  likePostRequest,
  ratePostRequest,
} from '../home/ducks/actions'
import { resetEditProfile } from '../edit-profile/ducks/actions'
import { sharePostRequest } from '../post-details/ducks/actions'

const mapStateToProps = (state: any) => ({
  authUser: authProfileSelector(state),
  currentUser: state.auth.currentUser,
  posts: postsProfileSelector(state),
  postsSecond: postsSelector(state),
  ...subscriptionCountSelector(state),
  loading: state.profile.loading,
  pagination: state.profile.pagination,
  allCategory: state.profile.allCategory,
  categoriesById: state.entities.categories,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getProfile: () => dispatch(getProfileRequest()),
  getRatingPosts: (userId: string) =>
    dispatch(getProfileRatingPostRequest(userId)),
  ratePost: (id: string, rating: number) =>
    dispatch(ratePostRequest(id, rating)),
  getPosts: (id: string, skip: number, limit: number) =>
    dispatch(getPostsByAuthorIdRequest(id, skip, limit)),
  likePost: (id: string) => dispatch(likePostRequest(id)),
  dislikePost: (id: string) => dispatch(dislikePostRequest(id)),
  clearEditProfile: () => dispatch(resetEditProfile()),
  sharePost: (id: string, text: string) => dispatch(sharePostRequest(id, text)),
  shareExternalPost: (id: string) => dispatch(shareExternalPostRequest(id)),
  getAllCategory: () => dispatch(getAllCategoryRequest()),
  deletePost: (id: string) => dispatch(deletePostRequest(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

import { connect } from 'react-redux'
import Home from './Home'
import { compose, Dispatch } from 'redux'
import { get } from 'lodash'

import withCustomHeader from '../../components/HOCs/withCustomHeader'
import localizedStrings from '../../localization'
import {
  blockUserRequest,
  deletePostRequest,
  dislikePostRequest,
  getPostsRequest,
  likePostRequest,
  ratePostRequest,
} from './ducks/actions'
import { postsSelector } from './ducks/selectors'
import {
  sharePostRequest,
  shareExternalPostRequest,
} from 'features/post-details/ducks/actions'
import { getAllCategoryRequest } from 'sagas/actions'

const mapStateToProps = (state: any) => ({
  posts: postsSelector(state),
  loading: state.home.loading,
  pagination: state.home.pagination,
  currentUserId: get(state, 'auth.currentUser._id', ''),
  deleteSuccess: state.home.deleteSuccess,
  blockUserSuccess: state.home.blockUserSuccess,
  blockType: state.home.blockType,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getPosts: (skip: number, limit: number, search: string) =>
    dispatch(getPostsRequest(skip, limit, search)),
  likePost: (id: string) => dispatch(likePostRequest(id)),
  dislikePost: (id: string) => dispatch(dislikePostRequest(id)),
  ratePost: (id: string, rating: number) =>
    dispatch(ratePostRequest(id, rating)),
  sharePost: (id: string, text: string) => dispatch(sharePostRequest(id, text)),
  shareExternalPost: (id: string) => dispatch(shareExternalPostRequest(id)),
  deletePost: (id: string) => dispatch(deletePostRequest(id)),
  blockUser: (id: string) => dispatch(blockUserRequest(id)),
  getAllCategory: () => dispatch(getAllCategoryRequest()),
})

const headerOptions = {
  title: localizedStrings.home.title,
  showMenuButton: true,
  showSearchButton: true,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCustomHeader(headerOptions),
)(Home)

import { shareExternalPostRequest } from './../post-details/ducks/actions'
import { connect } from 'react-redux'
import Search from './Search'
import { Dispatch } from 'redux'
import { get } from 'lodash'

import {
  blockUserRequest,
  deletePostRequest,
  dislikePostRequest,
  likePostRequest,
  ratePostRequest,
} from 'features/home/ducks/actions'
import {
  getUserListRequest,
  getSearchPostsRequest,
  resetSearchedListRequest,
  recommendedProfilesAndTopRankedBusiness,
  featuredMedia,
} from './ducks/actions'
import { searchSelector } from './ducks/selectors'
import { sharePostRequest } from 'features/post-details/ducks/actions'
import { followUser } from 'features/followers-following/ducks/actions'
import { resetItems } from '../explore/ducks/actions'
import { DEFAULT_FEATURE_MEDIA_PER_PAGE } from 'constants'
import { resetRecommendedProfilesAndTopRankedBusiness } from '../top-profiles/ducks/actions'

const mapStateToProps = (state: any) => ({
  authUser: state.auth.currentUser,

  currentUserId: get(state, 'auth.currentUser._id', ''),
  deleteSuccess: state.home.deleteSuccess,
  blockUserSuccess: state.home.blockUserSuccess,
  userIds: state.home.blockUserSuccess,

  posts: searchSelector(state),
  userList: state.search.userIds,
  loading: state.search.loading,
  pagination: state.search.pagination,

  topProfiles: state.search.profiles,
  topBusiness: state.search.topBusiness,

  mediaPagination: state.search.mediaPagination,
  mediaList: state.search.media,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  likePost: (id: string) => dispatch(likePostRequest(id)),
  dislikePost: (id: string) => dispatch(dislikePostRequest(id)),
  ratePost: (id: string, rating: number) =>
    dispatch(ratePostRequest(id, rating)),
  sharePost: (id: string, text: string) => dispatch(sharePostRequest(id, text)),
  shareExternalPost: (id: string) => dispatch(shareExternalPostRequest(id)),
  deletePost: (id: string) => dispatch(deletePostRequest(id)),
  blockUser: (id: string) => dispatch(blockUserRequest(id)),

  getUserList: (skip: number, limit: number, search: string) =>
    dispatch(getUserListRequest(skip, limit, search)),

  getSearchPosts: (skip: number, limit: number, search: string) =>
    dispatch(getSearchPostsRequest(skip, limit, search)),

  resetSearch: () => dispatch(resetSearchedListRequest()),

  followUser: (userId: string) => dispatch(followUser(userId)),

  // Explore
  resetExplore: () => {
    dispatch(resetItems())
  },
  fetchProfilesAndTopBusiness: (userId: string) =>
    dispatch(recommendedProfilesAndTopRankedBusiness(userId)),
  fetchFeaturedMedias: (
    skip: number = 0,
    limit: number = DEFAULT_FEATURE_MEDIA_PER_PAGE,
  ) => dispatch(featuredMedia(skip, limit)),
  resetRecommendTopProfileList: () =>
    dispatch(resetRecommendedProfilesAndTopRankedBusiness()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)

import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { useSelector } from 'react-redux'

import Explore from './Explore'
import {
  recommendedProfiles,
  topRankedBusinesses,
  featuredVideos,
  featuredPhotos,
  resetItems,
} from './ducks/actions'
import { DEFAULT_ITEMS_PER_PAGE } from 'constants'

const mapStateToProps = (state: any) => {
  const {
    loading,
    success,
    error,
    profiles,
    topBusinesses,
    featuredVideos,
    featuredPhotos,
    profileScrollEnded,
    businessScrollEnded,
    videosScrollEnded,
    photosScrollEnded,
    paginationProfiles,
    paginationBusinesses,
    paginationVideos,
    paginationPhotos,
  } = state.explore
  const authUser = state.auth.currentUser
  return {
    authUser,
    loading,
    success,
    error,
    profiles,
    topBusinesses,
    featuredVideos,
    featuredPhotos,
    profileScrollEnded,
    businessScrollEnded,
    videosScrollEnded,
    photosScrollEnded,
    paginationProfiles,
    paginationBusinesses,
    paginationVideos,
    paginationPhotos,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  reset: () => {
    dispatch(resetItems())
  },
  fetchRecommededProfiles: (
    userId: string,
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
    filterMin: number = 0,
    filterMax: number = 5,
  ) => dispatch(recommendedProfiles(userId, skip, limit, filterMin, filterMax)),
  fetchTopRankedBusinesses: (
    userId: string,
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
    filterMin: number = 0,
    filterMax: number = 5,
  ) => dispatch(topRankedBusinesses(userId, skip, limit, filterMin, filterMax)),
  fetchFeaturedVideos: (
    userId: string,
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
    filterMin: number = 0,
    filterMax: number = 5,
  ) => dispatch(featuredVideos(userId, skip, limit, filterMin, filterMax)),
  fetchFeaturedPhotos: (
    userId: string,
    skip: number = 0,
    limit: number = DEFAULT_ITEMS_PER_PAGE,
    filterMin: number = 0,
    filterMax: number = 5,
  ) => dispatch(featuredPhotos(userId, skip, limit, filterMin, filterMax)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Explore)

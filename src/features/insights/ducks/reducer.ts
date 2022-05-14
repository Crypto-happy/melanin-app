import createReducer from 'utils/createReducer'
import * as ActionTypes from './action-types'
import update from 'immutability-helper'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../constants'

const initialState = {
  postIds:[],
  customerReview: {
    total_likes:0,
    total_comments:0,
    shares:0,
    total_rated:0
  },
  profileStats:{
    interactions:0,
    female: 0,
    followersCount: 0,
    male: 0,
    ratingAvg: 0,
    visitsCount: 0,
  },
  pagination: {
    skip: 0,
    endReached: false,
  },
  loading: false,
  error: null,
  deleteSuccess: false,
  blockUserSuccess: false,
  interactionsGraph: null,
}

const handleGetCustomerReviewRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null }
  })
}

const handleCustomerReviewSuccess = (state, action) => {
    const reviews = action.payload.result
    return update(state, {
      loading: { $set: false },
      error: { $set: null },
      customerReview: { $set: reviews } 
    })
  }
  
const handleCustomerReviewFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}


const handleGetProfileStatsRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null }
  })
}

const handleProfileStatsSuccess = (state, action) => {
    const profileStats = action.payload.result;
    return update(state, {
      loading: { $set: false },
      error: { $set: null },
      profileStats: { $set: profileStats }
    })
  }
  
const handleProfileStatsFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleGetTopPostRequest = (state, action) => {
  const { skip } = action.payload
  return update(state, {
    loading: { $set: true },
    error: { $set: null },
    pagination: {
      skip: { $set: skip },
    },
  })
}

const handleTopPostSuccess = (state, action) => {
  //const ids = action.payload.result.map((post: any) => post.id)
  const ids = action.payload.result
 
  return update(state, {
    loading: { $set: false },
    error: { $set: null },
    postIds: state.pagination.skip > 0 ? { $push: ids } : { $set: ids },
    pagination: {
      endReached: { $set: ids.length < DEFAULT_ITEMS_PER_PAGE },
    },
  })
}
  
const handleTopPostFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}

const handleGetPageInteractionRequest = (state, action) => {
  return update(state, {
    loading: { $set: true },
    error: { $set: null }
  })
}

const handlePageInteractionSuccess = (state, action) => {
    const interactions = action.payload.result;


    return update(state, {
      loading: { $set: false },
      error: { $set: null },
      interactionsGraph: { $set: interactions }
    })
  }
  
const handlePageInteractionFailure = (state, action) => {
  return update(state, {
    loading: { $set: false },
    error: { $set: action.payload.error },
  })
}



const insightsReducer = createReducer(initialState, {
  [ActionTypes.GET_CUSTOMER_REVIEW_REQUEST]: handleGetCustomerReviewRequest,
  [ActionTypes.GET_CUSTOMER_REVIEW_SUCCESS]: handleCustomerReviewSuccess,
  [ActionTypes.GET_CUSTOMER_REVIEW_FAILURE]: handleCustomerReviewFailure,

  [ActionTypes.GET_PROFILE_STATS_REQUEST]: handleGetProfileStatsRequest,
  [ActionTypes.GET_PROFILE_STATS_SUCCESS]: handleProfileStatsSuccess,
  [ActionTypes.GET_PROFILE_STATS_FAILURE]: handleProfileStatsFailure,

  [ActionTypes.GET_TOP_POST_REQUEST]: handleGetPageInteractionRequest,
  [ActionTypes.GET_TOP_POST_SUCCESS]: handleTopPostSuccess,
  [ActionTypes.GET_TOP_POST_FAILURE]: handleTopPostFailure,

  [ActionTypes.GET_PAGE_INTERACTION_REQUEST]: handleGetTopPostRequest,
  [ActionTypes.GET_PAGE_INTERACTION_SUCCESS]: handlePageInteractionSuccess,
  [ActionTypes.GET_PAGE_INTERACTION_FAILURE]: handlePageInteractionFailure,
})
  
export default insightsReducer
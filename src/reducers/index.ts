import { combineReducers } from 'redux'
import authReducer from './auth'
import { registerReducer } from '../features/register'
import { loadingReducer } from '../features/loading'
import { loginReducer } from '../features/login'
import { forgotPasswordReducer } from '../features/forgot-password'
import { resetPasswordReducer } from '../features/reset-password'
import entitiesReducer from './entities'
import { homeReducer } from '../features/home'
import { searchReducer } from '../features/search'
import { profileReducer } from 'features/profile'
import { reportPostReducer } from '../features/report-post'
import { newPostReducer } from 'features/new-post'
import { userProfileReducer } from 'features/user-profile'
import { followerFollowingReducer } from 'features/followers-following'
import { editProfileReducer } from 'features/edit-profile'
import { settingsReducer } from '../features/settings'
import { postDetailsReducer } from 'features/post-details'
import { followTopicsReducer } from '../features/follow-topics'
import { reviewsReducer } from '../features/reviews'
import { businessCategoriesReducer } from 'features/business-categories'
import { chatReducer } from 'features/chat'
import socketReducer from 'reducers/socket'
import { chatRoomReducer } from 'features/chat-room'
import unreadsReducer from 'reducers/unreads'
import { notificationsReducer } from 'features/notifications'
import { insightsReducer } from 'features/insights'
import { changePasswordReducer } from 'features/change-password'

import { exploreReducer } from 'features/explore'
import { marketPlaceReducer } from 'features/marketPlace'
import { allproductsReducer } from 'features/allProduct'
import { topProfilesReducer } from 'features/top-profiles'
import { forumInterestsReducer } from 'features/select-forum-interests'
import { directoryResultsReducer } from '../features/directory-results'
import loyaltyTokensReducer from 'features/earnings/ducks/reducer'
import navigatorReducer from '../navigators/ducks/reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  entities: entitiesReducer,
  loading: loadingReducer,
  register: registerReducer,
  login: loginReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  home: homeReducer,
  search: searchReducer,
  profile: profileReducer,
  reportPost: reportPostReducer,
  newPost: newPostReducer,
  userProfile: userProfileReducer,
  followerFollowing: followerFollowingReducer,
  editProfile: editProfileReducer,
  settings: settingsReducer,
  postDetails: postDetailsReducer,
  followTopics: followTopicsReducer,
  userReviews: reviewsReducer,
  businessCategories: businessCategoriesReducer,
  notifications: notificationsReducer,
  chat: chatReducer,
  socket: socketReducer,
  chatRoom: chatRoomReducer,
  unreads: unreadsReducer,
  insights: insightsReducer,
  changePassword: changePasswordReducer,

  explore: exploreReducer,
  marketPlace: marketPlaceReducer,
  allProducts: allproductsReducer,

  topProfiles: topProfilesReducer,
  forumInterests: forumInterestsReducer,
  directoryResults: directoryResultsReducer,

  loyaltyTokens: loyaltyTokensReducer,
  navigator: navigatorReducer,
})

export default rootReducer

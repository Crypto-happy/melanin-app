import { all } from 'redux-saga/effects'
import { registerSaga } from '../features/register'
import { loadingSaga } from '../features/loading'
import { loginSaga } from '../features/login'
import { forgotPasswordSaga } from '../features/forgot-password'
import { resetPasswordSaga } from '../features/reset-password'
import { homeSaga } from '../features/home'
import { profileSaga } from 'features/profile'
import { reportPostSaga } from 'features/report-post'
import { newPostSaga } from 'features/new-post'
import { userProfileSaga } from 'features/user-profile'
import { followerFollowingSaga } from 'features/followers-following'
import { editProfileSaga } from 'features/edit-profile'
import { settingsSaga } from '../features/settings'
import { postDetailsSaga } from 'features/post-details'
import { followTopicsSaga } from '../features/follow-topics'
import { reviewsSaga } from '../features/reviews'
import { businessCategoriesSaga } from 'features/business-categories'
import { notificationsSaga } from 'features/notifications'
import chatSaga from 'features/chat/ducks/sagas'
import socketSaga from 'sagas/socket'
import { chatRoomSaga } from 'features/chat-room'
import unreadsSaga from 'sagas/unreads'
import categorySaga from 'sagas/category.sagas'
import { searchSaga } from '../features/search'
import { exploreSaga } from 'features/explore'
import { insightsSaga } from 'features/insights'
import { changePasswordSaga } from 'features/change-password'
import { marketPlaceSaga } from 'features/marketPlace'
import { allproductsSaga } from 'features/allProduct'
import { topProfilesSaga } from 'features/top-profiles'
import { forumInterestsSaga } from 'features/select-forum-interests'
import { directoryResultsSaga } from '../features/directory-results'
import { earningsSaga } from 'features/earnings'

function* rootSaga() {
  yield all([
    registerSaga(),
    loadingSaga(),
    loginSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
    homeSaga(),
    profileSaga(),
    reportPostSaga(),
    newPostSaga(),
    userProfileSaga(),
    followerFollowingSaga(),
    editProfileSaga(),
    settingsSaga(),
    postDetailsSaga(),
    followTopicsSaga(),
    reviewsSaga(),
    businessCategoriesSaga(),
    notificationsSaga(),
    chatSaga(),
    socketSaga(),
    chatRoomSaga(),
    unreadsSaga(),
    categorySaga(),
    searchSaga(),
    exploreSaga(),
    insightsSaga(),
    changePasswordSaga(),
    marketPlaceSaga(),
    allproductsSaga(),
    topProfilesSaga(),
    forumInterestsSaga(),
    directoryResultsSaga(),
    earningsSaga(),
  ])
}

export default rootSaga

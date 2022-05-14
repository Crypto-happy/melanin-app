import { call, put, takeLatest } from 'redux-saga/effects'
import {
  ADD_COMMENT_REQUEST,
  GET_POST_BY_ID_REQUEST,
  GET_POST_COMMENTS_REQUEST,
  LIKE_COMMENT_REQUEST,
  REPLY_COMMENT_REQUEST,
  SHARE_POST_REQUEST,
  SHARE_EXTERNAL_POST_REQUEST,
  DELETE_COMMENT_REQUEST,
  UPDATE_COMMENT_REQUEST,
} from './action-types'
import {
  addCommentFailure,
  addCommentSuccess,
  deleteCommentFailure,
  deleteCommentSuccess,
  getPostByIdFailure,
  getPostByIdSuccess,
  getPostCommentsFailure,
  getPostCommentsSuccess,
  likeCommentFailure,
  likeCommentSuccess,
  replyCommentFailure,
  replyCommentSuccess,
  sharePostFailure,
  sharePostSuccess,
  updateCommentFailure,
  updateCommentSuccess,
  shareExternalPostFailure,
  shareExternalPostSuccess,
} from 'features/post-details/ducks/actions'
import { commentApi, postsApi } from 'api'
import { constructPostsFromData } from '../../../utils/post.utils'
import { head } from 'lodash'

function* getPostDetails(action: any) {
  try {
    const { id } = action.payload
    const res = yield call(postsApi.getPost, id)
    const posts = yield call(constructPostsFromData, [res.data])
    yield put(getPostByIdSuccess(head(posts)))
  } catch (error) {
    yield put(getPostByIdFailure(error))
  }
}

function* sharePost(action: any) {
  try {
    const { id, text } = action.payload
    const res = yield call(postsApi.sharePost, id, text)
    yield put(sharePostSuccess(res.data))
  } catch (error) {
    yield put(sharePostFailure(error))
  }
}

function* shareExternalPost(action: any) {
  try {
    const { id, text } = action.payload
    const res = yield call(postsApi.shareExternalPost, id, text)
    yield put(shareExternalPostSuccess(res.data))
  } catch (error) {
    yield put(shareExternalPostFailure(error))
  }
}

function* addComment(action: any) {
  try {
    const { postId, text } = action.payload
    const res = yield call(commentApi.createComment, postId, text)
    yield put(addCommentSuccess(res.data))
  } catch (error) {
    yield put(addCommentFailure(error))
  }
}

function* replyComment(action: any) {
  try {
    const { commentId, text } = action.payload
    const res = yield call(commentApi.replyComment, commentId, text)
    yield put(replyCommentSuccess(res.data))
  } catch (error) {
    yield put(replyCommentFailure(error))
  }
}

function* likeComment(action: any) {
  try {
    const { commentId } = action.payload
    const res = yield call(commentApi.likeComment, commentId)
    yield put(likeCommentSuccess(res.data))
  } catch (error) {
    yield put(likeCommentFailure(error))
  }
}

function* getPostComments(action: any) {
  try {
    const { postId, skip, limit } = action.payload
    const res = yield call(postsApi.getPostComments, postId, skip, limit)
    yield put(getPostCommentsSuccess(res.data))
  } catch (error) {
    yield put(getPostCommentsFailure(error))
  }
}

function* deleteComment(action: any) {
  try {
    const { commentId } = action.payload
    const res = yield call(commentApi.deleteComment, commentId)
    yield put(deleteCommentSuccess(res.data, commentId))
  } catch (error) {
    yield put(deleteCommentFailure(error))
  }
}

function* updateComment(action: any) {
  try {
    const { commentId, text } = action.payload
    const res = yield call(commentApi.updateComment, commentId, text)
    yield put(updateCommentSuccess(res.data))
  } catch (error) {
    yield put(updateCommentFailure(error))
  }
}

function* postDetailsSaga() {
  yield takeLatest(GET_POST_BY_ID_REQUEST, getPostDetails)
  yield takeLatest(SHARE_POST_REQUEST, sharePost)
  yield takeLatest(SHARE_EXTERNAL_POST_REQUEST, shareExternalPost)
  yield takeLatest(GET_POST_COMMENTS_REQUEST, getPostComments)
  yield takeLatest(ADD_COMMENT_REQUEST, addComment)
  yield takeLatest(REPLY_COMMENT_REQUEST, replyComment)
  yield takeLatest(LIKE_COMMENT_REQUEST, likeComment)
  yield takeLatest(DELETE_COMMENT_REQUEST, deleteComment)
  yield takeLatest(UPDATE_COMMENT_REQUEST, updateComment)
}

export default postDetailsSaga

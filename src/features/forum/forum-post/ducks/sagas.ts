import { call, put, takeLatest, all } from 'redux-saga/effects'
import { CREATE_FORUM_POST_REQUEST } from './action-types'
import {
  createForumPostSuccess,
  createForumPostFailure,
  forumPostLoading,
  forumPostNotLoading,
} from './actions'
import { uploadApi, forumPostApi } from 'api'
import { isEmpty } from 'lodash'
import { transformForumPost } from './utils'

function* uploadAttachment(attachment: any) {
  const res = yield call(uploadApi.upload, attachment)
  return {
    type: attachment.type,
    url: res.data,
  }
}

function* createForumPost(action: any) {
  try {
    const { forumPost } = action.payload
    const newForumPost = transformForumPost(forumPost)
    const { attachments } = newForumPost

    if (!isEmpty(attachments)) {
      const uploadResult = yield all(
        attachments.map((attachment: any) =>
          call(uploadAttachment, attachment),
        ),
      )
      newForumPost.attachments = uploadResult
    }

    yield put(forumPostLoading())
    yield call(forumPostApi.createForumPost, newForumPost)
    yield put(createForumPostSuccess())
  } catch (error) {
    yield put(createForumPostFailure(error))
  } finally {
    yield put(forumPostNotLoading())
  }
}

function* forumPostSaga() {
  yield takeLatest(CREATE_FORUM_POST_REQUEST, createForumPost)
}

export default forumPostSaga

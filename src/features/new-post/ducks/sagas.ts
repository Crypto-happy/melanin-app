import { all, call, put, takeLatest } from 'redux-saga/effects'
import * as ActionTypes from './action-types'
import * as Actions from './actions'
import { postsApi, uploadApi } from 'api'
import { ATTACHMENT_TYPE } from 'types'
import { getFileNameFromPath } from 'utils'
import { get, isEmpty } from 'lodash'

async function uploadAttachment(attachment: any, uploadProgressHandler?: any) {
  const attachmentUploadResult = await uploadApi.upload(
    attachment,
    uploadProgressHandler,
  )
  const attachmentPayload = {
    type: attachment.type,
    url: attachmentUploadResult.data,
  }

  if (attachment.type === ATTACHMENT_TYPE.VIDEO && attachment.preview) {
    const previewPayload = {
      source: attachment.preview,
      mime: 'image/jpeg',
      fileName: getFileNameFromPath(attachment.preview),
    }
    const previewUploadResult = await uploadApi.upload(previewPayload)

    attachmentPayload.previewUrl = previewUploadResult.data
  }
  return attachmentPayload
}

function* submitPost(action: any) {
  try {
    const {
      post: { attachments, ...rest },
      uploadProgressHandler,
    } = action.payload
    const post = { ...rest, attachments: [] }
    if (!isEmpty(attachments)) {
      if (attachments[0].type === ATTACHMENT_TYPE.LINK) {
        post.attachments = yield attachments
      } else {
        post.attachments = yield all(
          attachments.map((attachment: any) => {
            return call(uploadAttachment, attachment, uploadProgressHandler)
          }),
        )
      }
    }
    const result = yield call(postsApi.createPost, post)
    yield put(Actions.submitPostSuccess(result))
  } catch (error) {
    yield put(Actions.submitPostFailure(error))
  }
}

function* updatePost(action: any) {
  try {
    const {
      post: { attachments, ...rest },
    } = action.payload

    const post = { ...rest, attachments: [] }
    const firstAttachmentId = get(attachments, '[0]._id', '')
    if (isEmpty(firstAttachmentId) && !isEmpty(attachments)) {
      post.attachments = yield all(
        attachments.map((attachment: any) => {
          return call(uploadAttachment, attachment)
        }),
      )
    } else {
      post.attachments = attachments
    }
    const result = yield call(postsApi.updatePost, post)
    yield put(Actions.updatePostSuccess(result.data))
  } catch (error) {
    yield put(Actions.updatePostFailure(error))
  }
}

function* product_categories(action: any) {
  try {
    const res = yield call(postsApi.getProductCategories)
    yield put(Actions.product_categories_success(res.data))
  } catch (error) {
    const errMessage = get(error, 'message', null)
    yield put(Actions.product_categories_failure(errMessage))
  }
}

function* newPostSaga() {
  yield takeLatest(ActionTypes.CATEGORIES, product_categories)
  yield takeLatest(ActionTypes.SUBMIT_POST_REQUEST, submitPost)
  yield takeLatest(ActionTypes.UPDATE_POST_REQUEST, updatePost)
}

export default newPostSaga

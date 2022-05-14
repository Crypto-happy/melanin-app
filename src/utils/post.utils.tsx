import { Post } from '../types/Post.types'
import { head, isEmpty } from 'lodash'
import { ATTACHMENT_TYPE } from 'types'
import { getImageSize } from './image.utils'
import update from 'immutability-helper'
import { Dimensions } from 'react-native'

const ATTACHMENT_PREVIEW_URL_TYPES: string[] = [
  ATTACHMENT_TYPE.VIDEO,
  ATTACHMENT_TYPE.LINK,
]
const { width: SCREEN_WIDTH } = Dimensions.get('screen')
const defaultHeight = 200

export const constructPostsFromData = async (postsData: Post[] = []) => {
  if (isEmpty(postsData)) {
    return postsData
  }

  const asyncPosts = postsData.map(async (post: Post) => {
    const { sharedFrom } = post
    const isSharedFrom = !isEmpty(sharedFrom)

    let attachments = post.attachments
    if (sharedFrom) {
      attachments = sharedFrom.attachments
    }

    if (isEmpty(attachments) || attachments.length > 1) {
      return post
    }

    const firstAttachment = head(attachments)
    if (!firstAttachment || typeof firstAttachment === 'string') {
      return post
    }

    const { type: attachmentType, previewUrl, url } = firstAttachment
    const imageUrl = ATTACHMENT_PREVIEW_URL_TYPES.includes(attachmentType)
      ? previewUrl
      : url

    const fileSize = await getImageSize(imageUrl, SCREEN_WIDTH, defaultHeight)
    if (isSharedFrom) {
      return update(post, {
        sharedFrom: {
          attachments: {
            0: {
              size: { $set: fileSize },
            },
          },
        },
      })
    } else {
      return update(post, {
        attachments: {
          0: {
            size: { $set: fileSize },
          },
        },
      })
    }
  })

  return await Promise.all(asyncPosts)
}

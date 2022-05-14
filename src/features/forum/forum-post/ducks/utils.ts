import { get } from 'lodash'
import { ATTACHMENT_TYPE } from 'types/index'
import { getFileNameFromPath } from 'utils/index'

export const transformForumPost = (forumPost: any) => {
  const { image, title, description, subCategory, tags } = forumPost

  const attachments = image.map((img: any) => ({
    type: ATTACHMENT_TYPE.PHOTO,
    source: img.path,
    mime: img.mime,
    fileName: img.filename || getFileNameFromPath(img.path),
  }))

  return {
    title,
    description,
    attachments,
    subCategoryId: get(subCategory, '_id', ''),
    tags,
  }
}

import { createSelector } from 'reselect'
import { isEmpty } from 'lodash'

const getPostEntities = (state: any) => state.entities.posts

const getAttachmentEntities = (state: any) => state.entities.attachments

const getCommentEntities = (state: any) => state.entities.comments

const getCommentIds = (state: any) => state.postDetails.commentIds

const getPostId = (state: any, ownProps: any) => ownProps.route.params.id

const getUserEntities = (state: any) => state.entities.users

const transformPost = (
  postEntities: any,
  attachmentEntities: any,
  postId: string,
) => {
  let post = { 
    ...postEntities[postId],
  }
  if (post?.attachments){
    post.attachments = post?.attachments?.map((id) => attachmentEntities[id])||[]
  }  
  return post
}

export const postSelector = createSelector(
  getPostEntities,
  getAttachmentEntities,
  getPostId,
  transformPost,
)

export const authorSelector = createSelector(
  getUserEntities,
  postSelector,
  (userEntities, post) => userEntities[post.author],
)

const transformComments = (
  commentIds: string[],
  commentEntities: any[],
  userEntities: any[],
) => {
  if (isEmpty(commentIds)) {
    return []
  }
  return commentIds.map((id) => {
    const comment = { ...commentEntities[id] } || {}
    comment.author = { ...userEntities[comment.author] }
    return comment
  })
}

export const commentsSelector = createSelector(
  getCommentIds,
  getCommentEntities,
  getUserEntities,
  transformComments,
)

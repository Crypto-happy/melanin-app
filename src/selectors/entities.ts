export const getPostEntities = (state: any) => state.entities.posts

export const getUserEntities = (state: any) => state.entities.users

export const getAttachmentsEntities = (state: any) => state.entities.attachments

export const getReviewEntities = (state: any) => state.entities.reviews

export const transformEntities = (postIds, posts, users, attachments) => {
  return postIds.map((postId: string) => {
    const post = posts[postId]
    return {
      ...post,
      author: users[post.author],
      attachments: post.attachments.map((id: string) => attachments[id]),
    }
  })
}

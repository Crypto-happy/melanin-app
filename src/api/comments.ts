import apiInstance from 'api/base'

export const createComment = async (postId: string, text: string) => {
  return apiInstance.post('comments', {
    postId,
    text,
  })
}

export const replyComment = async (commentId: string, text: string) => {
  return apiInstance.post(`comments/${commentId}/reply`, {
    text,
  })
}

export const likeComment = async (commentId: string) => {
  return apiInstance.post(`comments/${commentId}/like`)
}

export const deleteComment = async (commentId: string) => {
  return apiInstance.post(`comments/${commentId}/delete`)
}

export const updateComment = async (commentId: string, text: string) => {
  return apiInstance.put(`comments/${commentId}`, {
    text,
  })
}

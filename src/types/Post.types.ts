import { Attachment } from './Attachment.types'
import { UserType } from './User.types'

export interface Post {
  tags: Array<string>
  likes: Array<string>
  dislikes: Array<string>
  ratingAvg: number
  _id: string
  author: string | UserType
  text: string
  createdAt: string
  updatedAt: string
  rating: number
  attachments: Array<string | Attachment>
  commentsCount: number
  postsCount: number
  likesCount: number
  dislikesCount: number
  id: string
  sharedFrom?: Post
}

import { schema } from 'normalizr'

const userSchema = new schema.Entity('users', undefined, {
  idAttribute: '_id',
})

const commentSchema = new schema.Entity(
  'comments',
  {
    author: userSchema,
  },
  {
    idAttribute: '_id',
    processStrategy: (value, parent, key) => {
      return { ...value, post: parent.id }
    },
  },
)

const attachmentSchema = new schema.Entity('attachments', undefined, {
  idAttribute: '_id',
})

const postSchema = new schema.Entity(
  'posts',
  {
    author: userSchema,
    comments: [commentSchema],
    attachments: [attachmentSchema],
  },
  {
    idAttribute: '_id',
  },
)

const reviewSchema = new schema.Entity(
  'reviews',
  {
    author: userSchema,
  },
  {
    idAttribute: '_id',
  },
)

const chatMessageSchema = new schema.Entity(
  'chatMessages',
  {
    from: userSchema,
  },
  {
    idAttribute: '_id',
    processStrategy: (value, parent, key) => {
      return { ...value, chatRoom: parent.id }
    },
  },
)

const chatRoomSchema = new schema.Entity(
  'chatRooms',
  {
    users: [userSchema],
    latestChatMessage: chatMessageSchema,
  },
  {
    idAttribute: '_id',
  },
)

const subCategorySchema = new schema.Entity('subCategories', undefined, {
  idAttribute: '_id',
})

const categorySchema = new schema.Entity(
  'categories',
  {
    subCategories: [subCategorySchema],
  },
  {
    idAttribute: '_id',
  },
)

export {
  userSchema,
  postSchema,
  commentSchema,
  reviewSchema,
  chatMessageSchema,
  chatRoomSchema,
  subCategorySchema,
  categorySchema,
}

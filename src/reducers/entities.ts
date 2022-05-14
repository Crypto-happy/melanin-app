import createReducer from '../utils/createReducer'
import {
  DISLIKE_POST_SUCCESS,
  GET_POSTS_SUCCESS,
  LIKE_POST_SUCCESS,
  RATE_POST_SUCCESS,
} from 'features/home/ducks/action-types'
import { GET_SEARCH_POSTS_SUCCESS } from 'features/search/ducks/action-types'

import update from 'immutability-helper'
import 'utils/immutablility-helper'
import { normalize } from 'normalizr'
import {
  categorySchema,
  chatMessageSchema,
  chatRoomSchema,
  commentSchema,
  postSchema,
  reviewSchema,
  userSchema,
} from 'schemas'

import * as ProfileActionTypes from 'features/profile/ducks/action-types'
import * as UserProfileActionTypes from 'features/user-profile/ducks/action-types'
import * as FollowerFollowingActionTypes from 'features/followers-following/ducks/action-types'
import {
  ADD_COMMENT_SUCCESS,
  GET_POST_BY_ID_SUCCESS,
  GET_POST_COMMENTS_SUCCESS,
  LIKE_COMMENT_SUCCESS,
  REPLY_COMMENT_SUCCESS,
  UPDATE_COMMENT_SUCCESS,
} from 'features/post-details/ducks/action-types'
import { UPDATE_POST_SUCCESS } from 'features/new-post/ducks/action-types'
import * as ReviewActionTypes from 'features/reviews/ducks/action-types'
import { GET_BUSINESS_CATEGORIES_SUCCESS } from 'features/business-categories/ducks/action-types'
import {
  GET_CHAT_ROOMS_SUCCESS,
  MARK_CHAT_ROOM_READ,
} from 'features/chat/ducks/action-types'
import {
  CREATE_CHAT_ROOM_SUCCESS,
  GET_CHAT_MESSAGES_SUCCESS,
  PUT_ACTION_CHAT_ROOM_SUCCESS,
  GET_CHAT_ROOM_OF_MESSAGE_SUCCESS,
} from 'features/chat-room/ducks/action-types'
import {
  SOCKET_CHAT_MESSAGE,
  GET_ALL_CATEGORIES_SUCCESS,
} from 'sagas/action-types'
import { get, isEmpty, head } from 'lodash'
import { Dimensions, Image } from 'react-native'
import { Post } from '../types/Post.types'
import { ATTACHMENT_TYPE } from 'types'
import { getImageSize, getScaledHeight } from '../utils/image.utils'

const initialState = {
  posts: {},
  users: {},
  comments: {},
  attachments: {},
  reviews: {},
  categories: {},
  subCategories: {},
}

const handleGetPostsSuccess = (state, action) => {
  const { payload: { result = [] } = {} } = action

  if (isEmpty(result)) {
    return state
  }

  const normalizedPosts = normalize(result, [postSchema])

  return update(state, {
    posts: { $deepMerge: normalizedPosts.entities.posts },
    users: { $deepMerge: normalizedPosts.entities.users },
    comments: { $deepMerge: normalizedPosts.entities.comments },
    attachments: { $deepMerge: normalizedPosts.entities.attachments },
  })
}

const handleLikePostSuccess = (state, action) => {
  const { _id, likes, likesCount, dislikes, dislikesCount } =
    action.payload.result

  return update(state, {
    posts: {
      [_id]: {
        likes: { $set: likes },
        likesCount: { $set: likesCount },
        dislikes: { $set: dislikes },
        dislikesCount: { $set: dislikesCount },
      },
    },
  })
}

const handleDislikePostSuccess = (state, action) => {
  const updatedPost = action.payload.result

  return update(state, {
    posts: {
      [updatedPost._id]: {
        $merge: updatedPost,
      },
    },
  })
}

const handleRatePostSuccess = (state, action) => {
  const updatedPost = action.payload.result

  return update(state, {
    posts: {
      [updatedPost._id]: {
        $merge: updatedPost,
      },
    },
  })
}

const handleGetFollowByUserSuccess = (state, action) => {
  const normalizedUsers = normalize(action.payload.results, [userSchema])

  return update(state, {
    users: { $deepMerge: normalizedUsers.entities.users },
  })
}

const handleGetPostByIdSuccess = (state, action) => {
  const normalizedPosts = normalize(action.payload.result, postSchema)
  return update(state, {
    posts: { $deepMerge: normalizedPosts.entities.posts },
    attachments: { $deepMerge: normalizedPosts.entities.attachments },
    users: { $deepMerge: normalizedPosts.entities.users },
  })
}

const handleAddCommentSuccess = (state: any, action: any) => {
  const comment = action.payload.result
  const normalizedComments = normalize(comment, commentSchema)

  return update(state, {
    comments: { $deepMerge: normalizedComments.entities.comments },
    posts: {
      [comment.post]: {
        comments: {
          $autoArray: {
            $push: [comment._id],
          },
        },
        commentsCount: {
          $apply: (value: number) => value + 1,
        },
      },
    },
  })
}

const handleGetPostCommentsSuccess = (state: any, action: any) => {
  const normalizedComments = normalize(action.payload.result, [commentSchema])
  return update(state, {
    comments: { $deepMerge: normalizedComments.entities.comments },
    users: { $deepMerge: normalizedComments.entities.users },
  })
}

const handleLikeCommentSuccess = (state: any, action: any) => {
  const { likes, likesCount, _id, parent } = action.payload.result
  if (parent) {
    const index = state.comments[parent].children.findIndex(
      (comment) => comment.id === _id,
    )
    return update(state, {
      comments: {
        [parent]: {
          children: {
            [index]: {
              likes: { $set: likes },
              likesCount: { $set: likesCount },
            },
          },
        },
      },
    })
  }
  return update(state, {
    comments: {
      [_id]: {
        likes: { $set: likes },
        likesCount: { $set: likesCount },
      },
    },
  })
}

const handleReplyCommentSuccess = (state: any, action: any) => {
  const comment = action.payload.result

  return update(state, {
    comments: {
      [comment.parent]: {
        children: {
          $push: [comment],
        },
      },
    },
  })
}

const handleUpdateCommentSuccess = (state: any, action: any) => {
  const normalizedComments = normalize(action.payload.result, commentSchema)

  return update(state, {
    comments: { $deepMerge: normalizedComments.entities.comments },
  })
}

const handleUpdatePostSuccess = (state: any, action: any) => {
  const normalizedPosts = normalize(action.payload.result, postSchema)

  return update(state, {
    posts: { $deepMerge: normalizedPosts.entities.posts },
    users: { $deepMerge: normalizedPosts.entities.users },
    comments: { $deepMerge: normalizedPosts.entities.comments },
    attachments: { $deepMerge: normalizedPosts.entities.attachments },
  })
}

const handleGetReviewsSuccess = (state, action) => {
  const normalizedReviews = normalize(action.payload.result, [reviewSchema])

  return update(state, {
    reviews: { $deepMerge: normalizedReviews.entities.reviews },
    users: { $deepMerge: normalizedReviews.entities.users },
  })
}

const handleAddReviewSuccess = (state: any, action: any) => {
  const review = action.payload.result
  const normalizedReviews = normalize(review, reviewSchema)

  return update(state, {
    reviews: { $deepMerge: normalizedReviews.entities.reviews },
    users: { $deepMerge: normalizedReviews.entities.users },
  })
}

const handleGetBusinessCategoriesSuccess = (state: any, action: any) => {
  return update(state, {
    businessCategories: { $set: action.payload.result },
  })
}

const handleGetChatRoomsSuccess = (state: any, action: any) => {
  const normalizedChatRooms = normalize(action.payload.result, [chatRoomSchema])

  return update(state, {
    chatRooms: { $deepMerge: normalizedChatRooms.entities.chatRooms },
    users: { $deepMerge: normalizedChatRooms.entities.users },
    chatMessages: { $deepMerge: normalizedChatRooms.entities.chatMessages },
  })
}

const markChatRoomReadSuccess = (state: any, action: any) => {
  const { chatRoomId } = action.payload

  return update(state, {
    chatRooms: {
      [chatRoomId]: {
        unread: { $set: 0 },
      },
    },
  })
}

const handleGetChatMessagesSuccess = (state: any, action: any) => {
  const normalizedChatMessages = normalize(action.payload.result, [
    chatMessageSchema,
  ])

  return update(state, {
    chatMessages: { $deepMerge: normalizedChatMessages.entities.chatMessages },
    users: { $deepMerge: normalizedChatMessages.entities.users },
  })
}

const handleReceivedSocketChatMessage = (state: any, action: any) => {
  const normalizedResult = normalize(
    action.payload.chatMessage,
    chatMessageSchema,
  )

  return update(state, {
    chatMessages: { $deepMerge: normalizedResult.entities.chatMessages },
    users: { $deepMerge: normalizedResult.entities.users },
    chatRooms: { $deepMerge: normalizedResult.entities.chatRooms },
  })
}

const handleCreateChatRoomSuccess = (state: any, action: any) => {
  const normalizedResult = normalize(action.payload.result, chatRoomSchema)

  return update(state, {
    chatMessages: { $deepMerge: normalizedResult.entities.chatMessages },
    users: { $deepMerge: normalizedResult.entities.users },
    chatRooms: { $deepMerge: normalizedResult.entities.chatRooms },
  })
}

const handlePutActionOnChatRoomsSuccess = (state: any, action: any) => {
  const normalizedChatRooms = normalize(action.payload.result, chatRoomSchema)

  return update(state, {
    chatRooms: { $deepMerge: normalizedChatRooms.entities.chatRooms },
  })
}

const handleGetChatRoomOfMessageSuccess = (state: any, action: any) => {
  const normalizedResult = normalize(action.payload.result, chatRoomSchema)

  return update(state, {
    chatMessages: { $deepMerge: normalizedResult.entities.chatMessages },
    users: { $deepMerge: normalizedResult.entities.users },
    chatRooms: { $deepMerge: normalizedResult.entities.chatRooms },
  })
}

const handleGetAllCategorySuccess = (state: any, action: any) => {
  const allCategory = get(action, 'payload.results', [])
  const normalizedResult = normalize(allCategory, [categorySchema])

  return update(state, {
    categories: { $deepMerge: normalizedResult.entities.categories },
    subCategories: { $deepMerge: normalizedResult.entities.subCategories },
  })
}

const entitiesReducer = createReducer(initialState, {
  [GET_POSTS_SUCCESS]: handleGetPostsSuccess,
  [GET_SEARCH_POSTS_SUCCESS]: handleGetPostsSuccess,
  [ProfileActionTypes.GET_POSTS_BY_AUTHOR_ID_SUCCESS]: handleGetPostsSuccess,
  [UserProfileActionTypes.GET_POSTS_BY_AUTHOR_ID_SUCCESS]:
    handleGetPostsSuccess,
  [LIKE_POST_SUCCESS]: handleLikePostSuccess,
  [DISLIKE_POST_SUCCESS]: handleDislikePostSuccess,
  [RATE_POST_SUCCESS]: handleRatePostSuccess,
  [FollowerFollowingActionTypes.GET_FOLLOWINGS_SUCCESS]:
    handleGetFollowByUserSuccess,
  [FollowerFollowingActionTypes.GET_FOLLOWERS_SUCCESS]:
    handleGetFollowByUserSuccess,
  [GET_POST_BY_ID_SUCCESS]: handleGetPostByIdSuccess,
  [GET_POST_COMMENTS_SUCCESS]: handleGetPostCommentsSuccess,
  [ADD_COMMENT_SUCCESS]: handleAddCommentSuccess,
  [LIKE_COMMENT_SUCCESS]: handleLikeCommentSuccess,
  [REPLY_COMMENT_SUCCESS]: handleReplyCommentSuccess,
  [UPDATE_POST_SUCCESS]: handleUpdatePostSuccess,
  [ReviewActionTypes.GET_REVIEWS_SUCCESS]: handleGetReviewsSuccess,
  [ReviewActionTypes.ADD_NEW_REVIEW_SUCCESS]: handleAddReviewSuccess,
  [GET_BUSINESS_CATEGORIES_SUCCESS]: handleGetBusinessCategoriesSuccess,
  [GET_CHAT_ROOMS_SUCCESS]: handleGetChatRoomsSuccess,
  [MARK_CHAT_ROOM_READ]: markChatRoomReadSuccess,
  [GET_CHAT_MESSAGES_SUCCESS]: handleGetChatMessagesSuccess,
  [SOCKET_CHAT_MESSAGE]: handleReceivedSocketChatMessage,
  [CREATE_CHAT_ROOM_SUCCESS]: handleCreateChatRoomSuccess,
  [PUT_ACTION_CHAT_ROOM_SUCCESS]: handlePutActionOnChatRoomsSuccess,
  [GET_CHAT_ROOM_OF_MESSAGE_SUCCESS]: handleGetChatRoomOfMessageSuccess,
  [UPDATE_COMMENT_SUCCESS]: handleUpdateCommentSuccess,
  [GET_ALL_CATEGORIES_SUCCESS]: handleGetAllCategorySuccess,
})

export default entitiesReducer

import { createSelector } from 'reselect'
import { denormalize } from 'normalizr'
import { chatRoomSchema } from 'schemas'
import { get, isEmpty } from 'lodash'
import { ATTACHMENT_TYPE } from 'types'

const getEntities = (state: any) => state.entities

const getChatMessageIds = (state: any) => state.chatRoom.chatMessageIds

const getChatMessageEntities = (state: any) => state.entities.chatMessages

const getUserEntities = (state: any) => state.entities.users

const getChatRoomId = (state: any, ownProps: any) =>
  get(ownProps.route, 'params.chatRoomId', state.chatRoom.chatRoomId)

export const getSharedPost = (state: any, ownProps: any) =>
  get(ownProps.route, 'params.sharedPost')

const combineChatRoom = (chatRoomId: string, entities: any) => {
  if (!chatRoomId) {
    return null
  }
  return denormalize(
    get(entities, `chatRooms.${chatRoomId}`),
    chatRoomSchema,
    entities,
  )
}

const formatReplyMessage = (replyMessage: any) => {
  if (isEmpty(replyMessage)) {
    return null
  }

  const { _id, text, attachments } = replyMessage
  const firstAttachmentType = get(attachments, '[0].type', '')

  return {
    _id,
    text,
    image: firstAttachmentType === ATTACHMENT_TYPE.PHOTO ? attachments : null,
    audio: firstAttachmentType === ATTACHMENT_TYPE.AUDIO ? attachments : null,
  }
}

const combineChatMessages = (
  chatMessagesIds: string[],
  chatMessageEntities: any[],
  userEntities: any[],
) => {
  return chatMessagesIds.map((id: string) => {
    const rawMessage: any = chatMessageEntities[id]
    const {
      _id,
      text,
      from,
      createdAt,
      attachments,
      replyMessage,
      sharedPost,
    } = rawMessage
    const fromUser = userEntities[from]

    const firstAttachmentType =
      get(attachments, '[0].type') ?? get(sharedPost, 'attachments[0].type', '')

    const messageAttachments = isEmpty(attachments)
      ? get(sharedPost, 'attachments')
      : attachments

    let image = null
    if (!isEmpty(messageAttachments)) {
      if (firstAttachmentType === ATTACHMENT_TYPE.PHOTO) {
        image = messageAttachments
      } else if (firstAttachmentType === ATTACHMENT_TYPE.VIDEO) {
        image = messageAttachments.map(({ previewUrl, ...rest }) => ({
          ...rest,
          url: previewUrl,
        }))
      }
    }
    const audio =
      firstAttachmentType === ATTACHMENT_TYPE.AUDIO ? messageAttachments : null
    return {
      _id,
      createdAt,
      sharedPost,
      image,
      audio,
      text: text ?? sharedPost?.text,
      replyMessage: formatReplyMessage(replyMessage),
      user: fromUser,
    }
  })
}

export const chatMessagesSelector = createSelector(
  getChatMessageIds,
  getChatMessageEntities,
  getUserEntities,
  combineChatMessages,
)

export const chatRoomSelector = createSelector(
  getChatRoomId,
  getEntities,
  combineChatRoom,
)

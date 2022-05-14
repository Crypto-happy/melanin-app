import { createSelector } from 'reselect'

const getChatRoomIds = (state: any) => state.chat.chatRoomIds

const getChatRoomEntities = (state: any) => state.entities.chatRooms

const getUserEntities = (state: any) => state.entities.users

const getChatMessageEntities = (state: any) => state.entities.chatMessages

const transformChatRooms = (
  chatRoomsIds: string[],
  chatRoomEntities: any[],
  userEntities: any[],
  chatMessageEntities: any[],
) => {
  return chatRoomsIds.map((chatRoomId) => {
    const chatRoom = { ...chatRoomEntities[chatRoomId] }
    chatRoom.users = chatRoom.users.map((userId: string) => ({
      ...userEntities[userId],
    }))
    chatRoom.latestChatMessage = chatMessageEntities[chatRoom.latestChatMessage]
    return chatRoom
  })
}

export const chatRoomsSelector = createSelector(
  getChatRoomIds,
  getChatRoomEntities,
  getUserEntities,
  getChatMessageEntities,
  transformChatRooms,
)

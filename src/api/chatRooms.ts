import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import apiInstance from 'api/base'

export const getChatRooms = async (
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
  searchText: string = '',
) => {
  let params: any = {
    skip,
    limit,
    sortBy: 'createdAt:desc',
  }

  if (searchText !== '') {
    params.searchText = searchText
  }

  return apiInstance.get('chatRooms', {
    params,
  })
}

export const createChatRoom = async (userId: string) => {
  return apiInstance.post('chatRooms', {
    userId,
  })
}
export const getChatRoomOfMessage = async (messageId: string) => {
  return apiInstance.get(`chatMessages/${messageId}/chatRoom`)
}

export const putActionOnChatRoom = async (
  chatRoomId: string,
  actionType: string,
) => {
  return apiInstance.put('chatRooms/action', {
    chatRoomId,
    actionType,
  })
}

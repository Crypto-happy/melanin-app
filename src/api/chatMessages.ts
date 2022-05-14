import { DEFAULT_ITEMS_PER_PAGE } from 'constants'
import apiInstance from 'api/base'

export const getChatMessages = async (
  chatRoomId: string,
  skip: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE,
) => {
  return apiInstance.get('chatMessages', {
    params: {
      chatRoomId,
      skip,
      limit,
      sortBy: 'createdAt:desc',
    },
  })
}

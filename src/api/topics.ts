import apiInstance from './base'

export const getTopics = async () => {
  return apiInstance.get('topics')
}

export const followTopics = async (topics: string[]) => {
  return apiInstance.post('topics/follow', {
    topics,
  })
}

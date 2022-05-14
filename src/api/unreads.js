import apiInstance from 'api/base'

export const getUnreads = async () => {
  return apiInstance.get('unreads')
}

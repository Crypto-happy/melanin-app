import apiInstance from './base'

export const getNotifications = async () => {
  return apiInstance.get('notifications')
}
export const makeNotificationsSeen = async () => {
  return apiInstance.post('notifications')
}

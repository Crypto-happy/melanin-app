import apiInstance from './base'

export const getLoyaltyTokens = async () => {
  return apiInstance.get('users/me/loyalty_tokens')
}

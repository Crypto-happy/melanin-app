import apiInstance from './base'
import messaging from '@react-native-firebase/messaging'

export const register = async (data: any) => {
  try {
    await messaging().registerDeviceForRemoteMessages()
    const fcmToken = await messaging().getToken()
    return apiInstance.post('users/register', { ...data, fcmToken })
  } catch (error) {
    throw error
  }
}

export const fetchSiteUrls = async () => {
  try {
    return apiInstance.post('users/site_urls')
  } catch (error) {
    throw error
  }
}

export const login = async (email: string, password: string) => {
  await messaging().registerDeviceForRemoteMessages()
  const fcmToken = await messaging().getToken()
  return apiInstance.post('users/login', {
    email,
    password,
    fcmToken,
  })
}

export const forgotPassword = async (email: string) => {
  return apiInstance.post('users/forgot_password', {
    email,
  })
}

export const resetPassword = async (password: string, accessToken: string) => {
  return apiInstance.post(
    'users/reset_password',
    {
      password,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
}

export const changePassword = async (
  newPassword: string,
  oldPassword: string,
) => {
  return apiInstance.post('users/reset_password_auth', {
    newPassword,
    oldPassword,
  })
}

export const loginFacebook = async (userId: string, accessToken: string) => {
  return apiInstance.post('users/login_facebook', {
    userId,
    accessToken,
  })
}

export const loginAppleId = async (appleAuth: any) => {
  return apiInstance.post('users/login_apple_id', {
    ...appleAuth,
  })
}

export const logout = async () => {
  const fcmToken = await messaging().getToken()
  return apiInstance.post('users/logout', {
    fcmToken,
  })
}

export const blockUser = async (id: string) => {
  return apiInstance.post(`users/${id}/block`)
}

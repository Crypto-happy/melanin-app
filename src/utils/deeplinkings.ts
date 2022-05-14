import { Platform } from 'react-native'

export const makeFacebookSchemeFromId = (profileId: string) => {
  return (
    Platform.select({
      ios: `fb://profile?id=${profileId}`,
      android: `fb://facewebmodal/f?href=https://www.facebook.com/${profileId}`,
    }) || ''
  )
}

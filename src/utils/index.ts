import { POST_VISIBILITY } from 'constants'
import localizedStrings from 'localization'
import { Linking } from 'react-native'

export const getVisibilityString = (string: POST_VISIBILITY) => {
  const path = localizedStrings.newPost.visibility
  switch (string) {
    case POST_VISIBILITY.PUBLIC:
      return path.public
    case POST_VISIBILITY.FRIENDS:
      return path.friends
    case POST_VISIBILITY.ONLY_ME:
      return path.onlyMe
  }
}

export const getFileNameFromPath = (path: string) => {
  const split = path.split('/')
  return split[split.length - 1]
}

export const openUrl = async (url = '') => {
  try {
    const canOpenUrl = await Linking.canOpenURL(url)
    if (canOpenUrl) {
      let urlToOpen = url
      if (!urlToOpen.startsWith('http') && !urlToOpen.startsWith('https')) {
        urlToOpen = `http://${urlToOpen}`
      }
      await Linking.openURL(urlToOpen)
    }
  } catch (error) {}
}

export const convertArrayToObject = (array: any, key: string) => {
  const initialValue = {}
  return array.reduce((obj: Object, item: any) => {
    return {
      ...obj,
      [item[key]]: item,
    }
  }, initialValue)
}

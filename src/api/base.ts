import axios from 'axios'
import Config from 'react-native-config'
import { get } from 'lodash'
import { dispatch, getState } from 'store/root-store'
import { sessionExpired } from '../sagas/actions'

const apiInstance = axios.create({
  baseURL: Config.API_URL,
})

apiInstance.interceptors.request.use((config) => {
  const accessToken = get(getState(), 'auth.token')

  if (!config.headers?.Authorization && accessToken) {
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  return config
})

apiInstance.interceptors.response.use(undefined, (err: any) => {
  const error = err.response
  if (error.status === 401 && error.config && !error.config.__isRetryRequest) {
    dispatch(sessionExpired())
  }

  throw err
})

export default apiInstance

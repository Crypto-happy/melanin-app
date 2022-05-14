import { isEmpty } from 'lodash'

export const secondsToHms = (durationText: any) => {
  const duration = Number(durationText)
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration - hours * 3600) / 60)
  let seconds = duration - hours * 3600 - minutes * 60

  let result = ''
  if (hours > 0) {
    result = `${hours}`
  }

  const minutesText = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsText = seconds < 10 ? `0${seconds}` : `${seconds}`

  result = isEmpty(result)
    ? `${minutesText}:${secondsText}`
    : `${result}:${minutesText}:${secondsText}`
  return result
}

import update, { extend } from 'immutability-helper'
import { merge } from 'lodash'

extend('$deepMerge', (newObj, originObj) => ({ ...merge(originObj, newObj) }))

extend('$auto', function (value, object) {
  return object ? update(object, value) : update({}, value)
})
extend('$autoArray', function (value, object) {
  return object ? update(object, value) : update([], value)
})

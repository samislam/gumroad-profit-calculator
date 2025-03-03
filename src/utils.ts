import { isString } from 'lodash'

export function isNumericString(value: string) {
  // Use regex to ensure the string is strictly a valid number format
  return isString(value) && /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(value)
}

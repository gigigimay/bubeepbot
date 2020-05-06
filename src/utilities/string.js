import { prefix } from '../../config.json'

export const withStar = str => str && `\\*${str}\\*`

const matcher = new RegExp(`^${prefix}(\\w+)(?: (.+))?`)

export const clean = (str = '') => str.trim().replace(/\s\s+/g, ' ')

export const parseCommand = str => {
  const match = clean(str).match(matcher)
  return match && {
    name: match[1].toLowerCase(),
    param: match[2],
  }
}

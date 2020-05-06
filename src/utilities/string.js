import { prefix } from '../../config.json'

export const withStar = str => str && `\\*${str}\\*`

const matcher = new RegExp(`^${prefix}(\\w+)(?: (.+))?`)
export const parseCommand = str => {
  const match = str.match(matcher)
  return match && {
    name: match[1],
    param: match[2],
  }
}

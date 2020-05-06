import { prefix } from '../../config.json'

export const withStar = str => `\\*${str}\\*`

export const parseCommand = str => {
  const matcher = new RegExp(`^${prefix}(\\w+)(?: (.+))?`)
  const match = str.match(matcher)
  if (!match) return
  return {
    name: match[1],
    param: match[2],
  }
}

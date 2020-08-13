import { prefix } from '../config.json'
import { ParsedCommand } from '../types'

export const withStar = (str?: string): string => (str ? `\\*${str}\\*` : '')

export const beep = (str?: string): string =>
  str ? `${str} ${withStar('beep')}` : withStar('beep')

export const exampleCommand = (str: string): string =>
  `:speech_balloon: \`${prefix}${str}\``

const matcher = new RegExp(`^${prefix}(\\w+)(?: (.+))?`)
export const clean = (str = ''): string => str.trim().replace(/\s\s+/g, ' ')
export const parseCommand = (str: string): ParsedCommand | undefined => {
  const match = clean(str).match(matcher)
  return match
    ? {
      name: match[1].toLowerCase(),
      param: match[2],
    }
    : undefined
}

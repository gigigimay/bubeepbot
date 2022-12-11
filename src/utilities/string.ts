import config from '../config'
import { ParsedCommand } from '../types'

const { prefix } = config

export const withStar = (str?: string): string => (str ? `\\*${str}\\*` : '')

export const beep = (str?: string): string =>
  str ? `${str} ${withStar('beep')}` : withStar('beep')

export const exampleCommand = (str: string): string =>
  `:speech_balloon: \`${prefix}${str}\``

const matcher = new RegExp(`^${prefix}(\\S+)(?: (.+))?`)
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

/** converts hex color to an integer (to be used in Discord's embed messages) */
export const hexColorToNumber = (hex: string) => {
  const rrggbb = hex.slice(1)
  return parseInt(rrggbb, 16)
}

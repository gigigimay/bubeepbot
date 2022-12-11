import { APIEmbed } from 'discord.js'
import { BUBEEP_AVATAR, INVITE_URL } from '../constants'
import { hexColorToNumber } from '../utilities/string'

const embed = (override: Partial<APIEmbed> = {}): APIEmbed => {
  const defaultEmbed: APIEmbed = {
    color: hexColorToNumber('#65c6af'),
    title: 'Bubeep',
    author: {
      name: 'bubeep',
      icon_url: BUBEEP_AVATAR,
      url: INVITE_URL,
    },
    thumbnail: { url: BUBEEP_AVATAR },
    timestamp: new Date().toISOString(),
    footer: {
      text: '*bubeep*',
      icon_url: BUBEEP_AVATAR,
    },
  }

  return { ...defaultEmbed, ...override }
}

export default embed

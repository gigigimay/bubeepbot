import fp from 'lodash/fp'
import { BUBEEP_AVATAR, INVITE_URL } from '../constants'

const embed = (override = {}) => {
  const defaultEmbed = {
    color: '#65c6af',
    title: 'Bubeep',
    author: {
      name: 'bubeep',
      icon_url: BUBEEP_AVATAR,
      url: INVITE_URL,
    },
    thumbnail: { url: BUBEEP_AVATAR },
    timestamp: new Date(),
    footer: {
      text: '*bubeep*',
      icon_url: BUBEEP_AVATAR,
    },
  }

  return {
    embed: fp.merge(defaultEmbed, override),
  }
}

export default embed

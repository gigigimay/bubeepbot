import { Embed } from 'discord.js'
import { Pokemon } from './../types'
import fp from 'lodash/fp'
import { BUBEEP_AVATAR } from '../constants'
import { hexColorToNumber } from '../utilities/string'

const colorCode: Record<string, string> = {
  yellow: '#edec7b',
  black: '#171717',
  blue: '#67e2f5',
  brown: '#99744d',
  gray: '#adadad',
  green: '#8de65e',
  pink: '#ff919e',
  purple: '#ab71d1',
  red: '#f74554',
  white: '#f5f5f5',
}

const pokemonInfo = (data: Pokemon, override: any): Embed => {
  const {
    name, sprite, types = [], id, color,
  } = data
  const thumbnail = sprite
  const cardColor = colorCode[color]
  const mappedTypes = fp.flow(
    fp.sortBy(['type', 'slot']),
    fp.map(
      fp.flow(
        fp.get('type.name'),
        fp.upperCase,
      ),
    ),
    fp.join(', '),
  )(types)
  const defaultCard = {
    color: hexColorToNumber(cardColor),
    title: `#${id} ${fp.capitalize(name)}`,
    url: `https://bulbapedia.bulbagarden.net/wiki/${name}_(Pok%C3%A9mon)`,
    thumbnail: { url: thumbnail },
    fields: [
      {
        name: 'Type',
        value: mappedTypes,
        inline: true,
      },
    ],
    timestamp: new Date(),
    footer: {
      text: '*bubeep*',
      icon_url: BUBEEP_AVATAR,
    },
  }
  return fp.merge(defaultCard, override)
}

export default pokemonInfo

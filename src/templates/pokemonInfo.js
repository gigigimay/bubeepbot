import Discord from 'discord.js'
import fp from 'lodash/fp'

const colorCode = {
  yellow: '#edec7b',
  black: '#171717',
  blue: '#66d8f2',
  brown: '#99744d',
  gray: '#adadad',
  green: '#8de65e',
  pink: '#ff919e',
  purple: '#ab71d1',
  red: '#f74554',
  white: '#f5f5f5',
}

const pokemonInfo = (data, params) => {
  const {
    name, sprites, types = [], id, color,
  } = data
  const { title } = params
  const thumbnail = fp.get('front_default', sprites)
  const cardColor = colorCode[fp.get('name', color)]
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
  return new Discord.MessageEmbed()
    .setColor(cardColor)
    .setTitle(`#${id} ${fp.capitalize(name)}`)
    .setAuthor(title)
    .setURL(`https://bulbapedia.bulbagarden.net/wiki/${name}_(Pok%C3%A9mon)`)
    .setThumbnail(thumbnail)
    .addField('Type', mappedTypes)
    .setTimestamp()
    .setFooter('*bubeep*')
}

export default pokemonInfo

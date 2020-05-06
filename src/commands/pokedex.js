import pokemonInfo from '../templates/pokemonInfo'
import getPokemon from '../services/pokemon'
import { exampleCommand, beep, withStar } from '../utilities/string'
import { sendError } from '../utilities/message'

const error = [
  beep('You need to give bubeep a number.'),
  exampleCommand('pokedex 385 ditto'),
]

const execute = (message, param = '') => {
  if (!param) return message.channel.send(error)
  const params = param.split(' ')
  params.forEach(async p => {
    try {
      const data = await getPokemon(p)
      const info = pokemonInfo(data, { author: { name: `result of ${p}: ` } })
      message.channel.send(info)
    } catch (e) {
      sendError(e, message, `${withStar('BEEPBOOP')} Couldn't find data of \`${p}\``)
    }
  })
}

export default {
  name: 'pokedex',
  desc: 'Show info of pokemons by pokedex ID or English name.',
  aliases: ['poke', 'pokemon'],
  cooldown: 5,
  param: 2, // 0: no param, 1: optional, 2: required
  execute,
}

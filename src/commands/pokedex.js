import pokemonInfo from '../templates/pokemonInfo'
import getPokemon from '../services/pokemon'
import { exampleCommand, beep } from '../utilities/string'

const error = [
  beep('You need to give bubeep a number.'),
  exampleCommand('pokedex 385 ditto'),
]

const execute = (message, param = '') => {
  if (!param) return message.channel.send(error)
  const params = param.split(' ')
  params.forEach(async p => {
    const data = await getPokemon(p)
    if (!data) return message.channel.send(beep(`Can't find data of \`${p}\``))
    const info = pokemonInfo(data, { author: { name: `result of ${p}: ` } })
    message.channel.send(info)
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

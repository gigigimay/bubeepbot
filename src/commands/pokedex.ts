import pokemonInfo from '../templates/pokemonInfo'
import getPokemon from '../services/pokemon'
import { exampleCommand, beep, withStar } from '../utilities/string'
import { sendError } from '../helper/message'
import { CommandExecution, Command, CommandParamType } from '../types'
import { asyncForEach } from '../utilities/array'

const error = [
  beep('You need to give bubeep a number or a name.'),
  exampleCommand('pokedex 385 ditto'),
]

const execute: CommandExecution = ({ message, param = '' }) => {
  if (!param) return message.channel.send(error)
  const params = param.split(' ')
  asyncForEach(params, async (p) => {
    try {
      const data = await getPokemon(+p)
      const info = pokemonInfo(data, { author: { name: `result of ${p}: ` } })
      message.channel.send(info)
    } catch (e) {
      sendError(e, message, `${withStar('BEEPBOOP')} Couldn't find data of \`${p}\``)
    }
  })
}

const command: Command = {
  name: 'pokedex',
  desc: 'Show info of pokemons by pokedex ID or English name.',
  aliases: ['poke', 'pokemon'],
  cooldown: 5,
  param: CommandParamType.Required,
  execute,
}

export default command

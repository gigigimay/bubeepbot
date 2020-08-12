import { User } from 'discord.js'
import { CommandExecution } from './../types'
import pokemonInfo from '../templates/pokemonInfo'
import getPokemon from '../services/pokemon'
import { getCommandTarget } from '../helper/message'
import { getAvatarUrl } from '../helper/user'

const MAX_POKEMONS = 806

export const nameToNumber = (text:string):number => {
  const { length } = text
  return text.split('').reduce((total, curr) => {
    const charNum = curr.charCodeAt(0)
    return charNum % 2 ? total - charNum - length : total + charNum + length
  }, 0)
}

export const createPokemonID = ({ username = '', discriminator }:User, max:number):number => {
  let n = Number(discriminator) + nameToNumber(username)
  if (n === 0) return 0
  if (n < 0) n *= -1
  const r = n % max
  return max - r
}

const execute:CommandExecution = async ({ message, param }) => {
  const { target, aimed, tagged } = getCommandTarget(message, param)
  if (target){
    const noTagged = aimed
      ? 'You aimed poorly (not literally tagging) so the spell missed and backfired!'
      : 'You didn\'t aim anyone so the spell will be casted on yourself.'
    message.channel.send([
      tagged ? '' : noTagged,
      `:man_mage: Casting *pokemonify*, turning ${target} into a pokemon...`,
    ])

    const pokemonID = createPokemonID(target, MAX_POKEMONS)
    const data = await getPokemon(pokemonID)
    const info = pokemonInfo(data, {
      author: {
        name: `${target.username} is:`,
        icon_url: getAvatarUrl(target),
      },
    })
    message.channel.send(info)
  }
}

export default {
  name: 'pokemonify',
  desc: 'Turn a target into a pokemon!',
  cooldown: 5,
  param: 1, // 0: no param, 1: optional, 2: required
  execute,
}

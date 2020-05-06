import pokemonInfo from '../templates/pokemonInfo'
import getPokemon from '../services/pokemon'
import { getCommandTarget } from '../utilities/message'
import { getAvatarUrl } from '../utilities/user'

const MAX_POKEMONS = 806

export const createPokemonID = ({ username = '', discriminator, max }) => {
  const { length } = username
  const sumName = username.split('').reduce((total, curr) => {
    const charNum = curr.charCodeAt()
    return charNum % 2 ? total - charNum - length : total + charNum + length
  }, 0)
  let n = Number(discriminator) + sumName
  if (n === 0) return 0
  if (n < 0) n *= -1
  const r = n % max
  return max - r
}

const execute = async (message, param) => {
  const { target, aimed, tagged } = getCommandTarget(message, param)
  const noTagged = aimed
    ? 'You aimed poorly (not literally tagging) so the spell missed and backfired!'
    : 'You didn\'t aim anyone so the spell will be casted on yourself.'
  message.channel.send([
    tagged ? '' : noTagged,
    `:man_mage: Casting *pokemonify*, turning ${target} into a pokemon...`,
  ])

  const { username, discriminator } = target
  const pokemonID = createPokemonID({ username, discriminator, max: MAX_POKEMONS })
  const data = await getPokemon(pokemonID)
  const info = pokemonInfo(data, {
    author: {
      name: `${username} is:`,
      icon_url: getAvatarUrl(target),
    },
  })
  message.channel.send(info)
}

export default {
  name: 'pokemonify',
  desc: 'Turn a target into a pokemon!',
  param: 1, // 0: no param, 1: optional, 2: required
  execute,
}

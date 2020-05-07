/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import Discord from 'discord.js'
import { beep } from '../utilities/string'

const cooldowns = new Discord.Collection()

export default (message, command) => {
  const { name } = command
  const { id } = message.author

  // handle cooldown
  if (!cooldowns.has(name)) {
    cooldowns.set(name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(id)) {
    const expirationTime = timestamps.get(id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      message.reply(beep(`command \`${name}\` is on cooldown, :timer: ${timeLeft.toFixed(1)} second(s) to go.`))
      return
    }
  }
  // add cooldown
  timestamps.set(id, now)
  setTimeout(() => timestamps.delete(id), cooldownAmount)
  return true
}

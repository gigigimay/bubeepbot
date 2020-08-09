import Discord, { Collection } from 'discord.js'
import { beep } from '../utilities/string'
import { Command } from '../types'

const cooldowns = new Discord.Collection<string, Collection<string, number>>()

export default async (message: Discord.Message, command: Command): Promise<void> => {
  const { name } = command
  const { id } = message.author

  // handle cooldown
  if (!cooldowns.has(name)) {
    cooldowns.set(name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  const commandTimestamp = timestamps?.get(id)

  if (commandTimestamp) {
    const expirationTime = commandTimestamp + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      const error = beep(`command \`${name}\` is on cooldown, :timer: ${timeLeft.toFixed(1)} second(s) to go.`)
      await message.reply(error)
      throw new Error('cooldown')
    }
  }

  // add cooldown
  timestamps?.set(id, now)
  setTimeout(() => timestamps?.delete(id), cooldownAmount)
}

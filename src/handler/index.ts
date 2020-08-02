import { withStar } from '../utilities/string'
import { sendError } from '../helper/message'
import { getCommand } from '../helper/command'
import handleCooldown from './cooldown'
import { Message } from 'discord.js'
import { ParsedCommand } from '../types'

export default async ({ name, param }: ParsedCommand, message: Message): Promise<void> => {
  const command = getCommand(name)

  // handle unknown commands
  if (!command) {
    await message.channel.send(`${withStar('BUBEEP')} Did you cast a wrong spell? :face_with_raised_eyebrow:`)
    return
  }

  if (!handleCooldown(message, command)) return

  // execute command
  try {
    await command.execute({ message, param })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e.message)
    sendError(e, message, `${withStar('BUBEEP')} Mr.Stark, I don't feel so good. :nauseated_face:`)
  }
}

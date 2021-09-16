import { withStar } from '../utilities/string'
import { sendError } from '../helper/message'
import { getCommand } from '../helper/command'
import handleCooldown from './cooldown'
import { Message } from 'discord.js'
import { ParsedCommand } from '../types'
import { createLogger } from '../utilities/logger'

const logger = createLogger()

export default async ({ name, param }: ParsedCommand, message: Message): Promise<void> => {
  const command = getCommand(name)

  // handle unknown commands
  if (!command) {
    await message.channel.send(`${withStar('BUBEEP')} Did you cast a wrong spell? :face_with_raised_eyebrow:`)
    return
  }

  // execute command
  try {
    await handleCooldown(message, command)
    await command.execute({ message, param })
  } catch (e) {
    if (e.message !== 'cooldown') {
      logger.error(e)
      sendError(e, message, `${withStar('BUBEEP')} Mr.Stark, I don't feel so good. :nauseated_face:`)
    }
  }
}

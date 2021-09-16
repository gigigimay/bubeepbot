import { CommandInteraction } from 'discord.js'
import { createLogger } from '../utilities/logger'

const logger = createLogger('handler/interaction.ts')

export const handleCommandInteraction = (interaction: CommandInteraction): void => {
  try {
    // TODO: handle more commands
    if (interaction.commandName === 'ping') {
      interaction.reply('Pong!')
    }
  } catch (e) {
    logger.error('logger')
    interaction.reply(e.message)
  }
}

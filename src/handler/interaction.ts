import { CommandInteraction } from 'discord.js'
import { getCommand } from '../helper/command'
import { createLogger } from '../utilities/logger'

const logger = createLogger('handler/interaction.ts')

export const handleCommandInteraction = (interaction: CommandInteraction): void => {
  try {
    const command = getCommand(interaction.commandName)
    command?.interactionExecute?.(interaction)
  } catch (e: any) {
    logger.error(e)
    interaction.reply(e.message)
  }
}

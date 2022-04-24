import { CommandInteraction } from 'discord.js'
import { getCommand } from '../helper/command'
import { getErrorMessage } from '../helper/message'
import { createLogger } from '../utilities/logger'
import { withStar } from '../utilities/string'

const logger = createLogger('handler/interaction.ts')

export const handleCommandInteraction = async (interaction: CommandInteraction): Promise<void> => {
  try {
    const command = getCommand(interaction.commandName)
    await command?.interactionExecute?.(interaction)
  } catch (e: any) {
    logger.error(e)
    interaction.reply(getErrorMessage(e, `${withStar('BUBEEP')} Mr.Stark, I don't feel so good. :nauseated_face:`))
  }
}

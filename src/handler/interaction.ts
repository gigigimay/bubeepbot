import { CommandInteraction } from 'discord.js'
import { createLogger } from '../utilities/logger'

const logger = createLogger('handler/interaction.ts')

export const handleCommandInteraction = (interaction: CommandInteraction): void => {
  try {
    // TODO: handle more commands in a more structured way
    if (interaction.commandName === 'ping') {
      interaction.reply('Pong!')
    }
    if (interaction.commandName === 'beep') {
      interaction.reply('Beep!')
    }
  } catch (e) {
    logger.error('logger')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    interaction.reply((e as any).message)
  }
}

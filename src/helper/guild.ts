import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { SlashCommandBuilder } from '@discordjs/builders'
import { createLogger } from '../utilities/logger'

const logger = createLogger('helper/guild.ts')

const BOT_TOKEN = process.env.BOT_TOKEN ?? ''
const CLIENT_ID = process.env.CLIENT_ID ?? ''

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN)

export const refreshGuildCommands = async (
  guildId: string,
  commandConfig: SlashCommandBuilder[],
): Promise<void> => {
  try {
    logger.info(`Started refreshing application (/) commands for guildId ${guildId}.`)
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guildId),
      { body: commandConfig },
    )
    logger.info(`Successfully reloaded application (/) commands for guildId ${guildId}.`)
  } catch (error) {
    logger.error(error)
  }
}

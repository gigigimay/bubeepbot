import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { createLogger } from '../utilities/logger'
import { getSlashCommands } from './command'

const logger = createLogger('helper/guild.ts')

const BOT_TOKEN = process.env.BOT_TOKEN ?? ''
const CLIENT_ID = process.env.CLIENT_ID ?? ''

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN)

export const refreshGuildCommands = async (guildId: string): Promise<void> => {
  try {
    logger.info(`Started refreshing application (/) commands for guildId ${guildId}.`)
    const commandConfig = getSlashCommands()
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guildId),
      { body: commandConfig },
    )
    logger.info(`Successfully reloaded application (/) commands for guildId ${guildId}.`)
  } catch (error) {
    logger.error(error)
  }
}

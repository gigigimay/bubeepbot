import { Client, Intents } from 'discord.js'
import { getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice'
import { parseCommand } from './utilities/string'
import handler from './handler'
import { getSlashCommands, init as initCommands } from './helper/command'
import { refreshGuildCommands } from './helper/guild'
import { createLogger } from './utilities/logger'
import { handleCommandInteraction } from './handler/interaction'

const logger = createLogger('index.ts')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
})

initCommands()
const slashCommands = getSlashCommands()

// trigger once after logging in
client.once('ready', () => {
  logger.info(`[${client.user?.tag}] ready to comply.`)
})

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) { return }
  handleCommandInteraction(interaction)
})

// // subscribe to message event
client.on('messageCreate', (message) => {
  // FIXME move to message command
  if (message.content === 'refresh') {
    if (message.guildId) {
      refreshGuildCommands(message.guildId, slashCommands)
      message.reply('refreshing command done!')
      return
    }
  }

  if (message.author.bot) return
  const parsed = parseCommand(message.content)
  if (parsed) {
    handler(parsed, message)
  }
})

client.on('error', (error) => {
  logger.error(error)
})

client.login(process.env.BOT_TOKEN)

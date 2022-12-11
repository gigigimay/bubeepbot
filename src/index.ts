import { Client } from 'discord.js'
import { parseCommand } from './utilities/string'
import handler from './handler'
import { init as initCommands } from './helper/command'
import { createLogger } from './utilities/logger'
import { handleCommandInteraction } from './handler/interaction'

const logger = createLogger('index.ts')

const client = new Client({
  intents: [
    'Guilds',
    'GuildMessages',
    'GuildVoiceStates',
    'MessageContent'
  ],
})

initCommands()

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

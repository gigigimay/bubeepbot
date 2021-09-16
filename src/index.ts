import { Client, Intents } from 'discord.js'
import { parseCommand } from './utilities/string'
import handler from './handler'
import { init as initCommands } from './helper/command'
import { refreshGuildCommands } from './helper/guild'
import { createLogger } from './utilities/logger'
import { handleCommandInteraction } from './handler/interaction'

const logger = createLogger('index.ts')

// FIXME
const slashCommands = [{
  name: 'ping',
  description: 'Replies with Pong!',
}]

// FIXME: make a message command for this
refreshGuildCommands('707283564655280230', slashCommands)

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
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
  // FIXME
  console.log('message >>>', message.guildId)

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

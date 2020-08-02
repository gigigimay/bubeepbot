import Discord from 'discord.js'
import { parseCommand } from './utilities/string'
import handler from './handler'
import { init as initCommands } from './helper/command'

const client = new Discord.Client()
initCommands()

// trigger once after logging in
client.once('ready', () => {
  console.log('ready to comply')
})

// subscribe to message event
client.on('message', message => {
  if (message.author.bot) return
  const parsed = parseCommand(message.content)
  if (parsed) {
    handler(parsed, message)
  }
})

client.login(process.env.BOT_TOKEN)

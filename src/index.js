import Discord from 'discord.js'
import { parseCommand } from './utilities/string'
import handler from './handler'

const client = new Discord.Client()

// trigger after logging in
client.once('ready', () => {
  console.log('ready to comply')
})

client.on('message', message => {
  // console.log(message.content)
  if (message.author.bot) return
  const parsed = parseCommand(message.content)
  if (parsed) {
    handler(parsed, message)
  }
})

client.login(process.env.BOT_TOKEN)

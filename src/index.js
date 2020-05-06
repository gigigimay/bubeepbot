/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import fs from 'fs'
import Discord from 'discord.js'
import { parseCommand } from './utilities/string'
import handler from './handler'

const client = new Discord.Client()
client.commands = new Discord.Collection()

// init commands
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.match(/^\w+(?!test)\.js$/))
commandFiles.forEach(file => {
  const command = require(`./commands/${file}`).default
  client.commands.set(command.name, command)
})

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

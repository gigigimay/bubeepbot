/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import Discord from 'discord.js'
import { parseCommand } from './utilities/string'
import handler from './handler'
import { MyClient, Command } from './types'

const client: MyClient = new Discord.Client()
client.commands = new Discord.Collection()

// init commands
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.match(/^\w+(?!test)\.(js|ts)$/))
commandFiles.forEach(file => {
  const command: Command = require(`./commands/${file}`).default
  if (command) { client.commands?.set(command.name, command) }
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

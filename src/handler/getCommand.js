/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import fs from 'fs'
import Discord from 'discord.js'

const commands = new Discord.Collection()

const dir = __dirname.split('/')
dir.pop()
const path = dir.join('/')
const commandFiles = fs.readdirSync(`${path}/commands`).filter(file => file.match(/^\w+(?!test)\.js$/))

commandFiles.forEach(file => {
  const command = require(`../commands/${file}`).default
  commands.set(command.name, command)
})

export default name => commands.get(name)
  || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name))

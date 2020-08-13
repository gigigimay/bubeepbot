/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import Discord from 'discord.js'
import { Command } from '../types'

const Commands = new Discord.Collection<string, Command>()

export const init = (): void => {
  const path = __dirname.replace(/helper$/, 'commands')
  const commandFiles = fs.readdirSync(path).filter((file) => file.match(/^\w+(?!test)\.(js|ts)$/))
  commandFiles.forEach((file) => {
    const command: Command = require(`../commands/${file}`).default
    if (command) { Commands.set(command.name, command) }
  })
}

export const getCommand = (name: string): Command | undefined => {
  return Commands.get(name) ??
    Commands.find((cmd: Command) => cmd.aliases ? cmd.aliases.includes(name) : false)
}

export default Commands

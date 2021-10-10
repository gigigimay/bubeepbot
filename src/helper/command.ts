/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import Discord from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command, CommandParamType } from '../types'

const Commands = new Discord.Collection<string, Command>()

/** init all commands in the project */
export const init = (): void => {
  const path = __dirname.replace(/helper$/, 'commands')

  // read all files in `src/commands` folder
  const commandFiles = fs.readdirSync(path).filter((file) => file.match(/^\w+(?!test)\.(js|ts)$/))

  // set command name into the collection
  commandFiles.forEach((file) => {
    const command: Command = require(`../commands/${file}`).default
    if (command) { Commands.set(command.name, command) }
  })
}

/** get command config from name or alias */
export const getCommand = (name: string): Command | undefined => {
  return Commands.get(name) ??
    Commands.find((cmd: Command) => cmd.aliases ? cmd.aliases.includes(name) : false)
}

export const getSlashCommands = (): SlashCommandBuilder[] => {
  const result: SlashCommandBuilder[] = []
  Commands.forEach((command) => {
    if (!command.interactionExecute) {
      return
    }

    const builder = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.desc ?? '')

    if (command.param !== CommandParamType.None) {
      builder.addStringOption((option) => option.setName('param')
        .setDescription('param')
        .setRequired(command.param === CommandParamType.Required))
    }

    result.push(builder)
  })
  return result
}

export default Commands

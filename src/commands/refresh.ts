import { CommandExecution, Command, CommandParamType, CommandInteractionExecution } from './../types'
import { refreshGuildCommands } from '../helper/guild'

const execute: CommandExecution = async ({ message, param = '' }) => {
  if (message.guildId) {
    await refreshGuildCommands(message.guildId)
    message.reply('refreshing command done!')
  }
}

const interactionExecute: CommandInteractionExecution = async (interaction) => {
  if (interaction.guildId) {
    await refreshGuildCommands(interaction.guildId)
    return interaction.reply('refreshing command done!')
  }
  return interaction.reply('no channel')
}

const command: Command = {
  name: 'refresh',
  desc: 'refresh data of Bubeep\'s slash commands for this channel',
  param: CommandParamType.None,
  execute,
  interactionExecute,
}

export default command

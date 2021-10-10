import { CommandInteractionExecution, CommandExecution, Command, CommandParamType } from './../types'
import { exampleCommand, beep } from '../utilities/string'

const error = [
  beep('You need to tell bubeep what to *echo*.'),
  exampleCommand('echo hello'),
].join('\n')

const getContent = (text: string | null | undefined): string => {
  return text ? [text, text, text, beep()].join(' ') : error
}

const execute: CommandExecution = ({ message, param }) => (
  message.channel.send(getContent(param))
)

const interactionExecute: CommandInteractionExecution = (interaction) => {
  const param = interaction.options.getString('param')
  interaction.reply(getContent(param))
}

const command: Command = {
  name: 'echo',
  desc: 'I say whatever you say x3',
  param: CommandParamType.Required,
  execute,
  interactionExecute,
}

export default command

import { exampleCommand, beep } from '../utilities/string'
import { CommandExecution, Command, CommandParamType } from '../types'

const error = [
  beep('You need to tell bubeep what to *echo*.'),
  exampleCommand('echo hello'),
]

const execute: CommandExecution = ({ message, param }) => (param
  ? message.channel.send([param, param, param, beep()].join(' '))
  : message.channel.send(error.join('\n')))

const command: Command = {
  name: 'echo',
  desc: 'I say whatever you say x3',
  param: CommandParamType.Required,
  execute,
}

export default command

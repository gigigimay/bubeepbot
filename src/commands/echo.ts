import { exampleCommand, beep } from '../utilities/string'
import { CommandExecution, Command } from '../types'

const error = [
  beep('You need to tell bubeep what to *echo*.'),
  exampleCommand('echo hello'),
]

const execute: CommandExecution = ({ message, param }) => (param
  ? message.channel.send([param, param, param, beep()].join(' '))
  : message.channel.send(error))

const command: Command = {
  name: 'echo',
  desc: 'I say whatever you say x3',
  param: 2,
  execute,
}

export default command

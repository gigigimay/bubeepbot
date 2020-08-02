import { exampleCommand, beep } from '../utilities/string'
import { CommandExecution } from '../types'

const error = [
  beep('You need to tell bubeep what to *echo*.'),
  exampleCommand('echo hello'),
]

const execute: CommandExecution = ({ message, param }) => (param
  ? message.channel.send([param, param, param, beep()].join(' '))
  : message.channel.send(error))

export default {
  name: 'echo',
  desc: 'I say whatever you say x3',
  param: 2, // 0: no param, 1: optional, 2: required
  execute,
}

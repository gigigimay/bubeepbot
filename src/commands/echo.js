import { withStar, exampleCommand } from '../utilities/string'

const error = [
  `You need to tell bubeep what to **echo**. ${withStar('beep')}`,
  exampleCommand('echo hello'),
]

const execute = (message, param = '') => (param
  ? message.channel.send([param, param, param, withStar('beep')].join(' '))
  : message.channel.send(error))

export default {
  name: 'echo',
  desc: 'I say whatever you say x3',
  param: 2, // 0: no param, 1: optional, 2: required
  execute,
}

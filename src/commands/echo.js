import { prefix } from '../../config.json'
import { withStar } from '../utilities/string'

const error = [
  `You need to tell bubeep what to *echo*. ${withStar('beep')}`,
  `:speech_balloon: \`${prefix}echo hello\``,
]

const execute = (message, param = '') => (param
  ? message.channel.send([param, param, param, withStar('beep')].join(' '))
  : message.channel.send(error))

export default {
  name: 'echo',
  desc: 'I say whatever you say x3',
  param: true,
  execute,
}

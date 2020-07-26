import { beep, exampleCommand } from '../utilities/string'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'

const emptyParamError = [
  beep('Please tell bubeep what to *sakod*.'),
  exampleCommand('sakod eiei'),
]

const execute = ({ connection, param }) => {
  const word = param.split('').join(' ')
  connection.play(getVoiceLine(word))
}

const checkBeforeJoin = ({ param }) => !param && emptyParamError

export default {
  name: 'sakod',
  desc: 'I sakod.',
  param: 2, // 0: no param, 1: optional, 2: required
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

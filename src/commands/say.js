import { beep, exampleCommand } from '../utilities/string'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('say goodnight'),
]

const execute = ({ connection, param }) => {
  connection.play(getVoiceLine(param))
}

const checkBeforeJoin = ({ param }) => !param && emptyParamError

export default {
  name: 'say',
  desc: 'I say.',
  param: 2, // 0: no param, 1: optional, 2: required
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
}

import {
  WithVoiceChannelCallback,
  WithVoiceChannelCheckBeforeJoin,
  Command,
} from './../types'
import { beep, exampleCommand } from '../utilities/string'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('say goodnight'),
]

const execute: WithVoiceChannelCallback = async ({ connection, param }) => {
  if (param) {
    connection.play(getVoiceLine(param))
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = ({ param }) =>
  !param && emptyParamError

const command: Command = {
  name: 'say',
  desc: 'I say.',
  param: 2,
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command

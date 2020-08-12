import { WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from './../types'
import { beep, exampleCommand } from '../utilities/string'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('say goodnight'),
]

const execute:WithVoiceChannelCallback = async({ connection, param }) => {
  if (param){
    connection.play(getVoiceLine(param))
    return}
}

const checkBeforeJoin:WithVoiceChannelCheckBeforeJoin = ({param}) => !param && emptyParamError

export default {
  name: 'say',
  desc: 'I say.',
  param: 2, // 0: no param, 1: optional, 2: required
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

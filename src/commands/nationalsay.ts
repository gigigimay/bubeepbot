import { getVoiceLineNational } from './../helper/tts'
import { Command, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
import { beep, exampleCommand } from '../utilities/string'

import { withVoiceChannel } from '../helper/execute'

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('nationalsay th/male/goodnight'),
]

const error = [
  beep('You may give bubeep not enough information.'),
  exampleCommand('nationalsay th/male/goodnight'),
]

const errorWrongParam = [
  beep('You may give bubeep not correct data.'),
  exampleCommand('nationalsay th/male/goodnight'),
]

const execute: WithVoiceChannelCallback = async ({ connection, param, message }) => {
  if (param) {
    const params = param.split('/')
    if (params.length === 3) {
      try {
        connection.play(getVoiceLineNational(params[0], params[1], params[2]))
      } catch {
        message.channel.send(errorWrongParam)
      }
    } else {
      message.channel.send(error)
    }
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = ({ param }) => !param && emptyParamError

const command: Command = {
  name: 'nationalsay',
  desc: 'My friend will say it. (my friend list: https://responsivevoice.org/text-to-speech-languages/)',
  param: 2, // 0: no param, 1: optional, 2: required
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command

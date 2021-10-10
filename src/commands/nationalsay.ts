import { getVoiceLineNational } from './../helper/tts'
import { Command, CommandParamType, WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin } from '../types'
import { beep, exampleCommand } from '../utilities/string'
import { playSound } from '../helper/connection'

import { withVoiceChannel } from '../helper/execute'

const emptyParamError = [
  beep('Please tell bubeep what to *say*.'),
  exampleCommand('nationalsay th/male/goodnight'),
]

const invalidParamError = [
  beep('You may give bubeep not enough information.'),
  exampleCommand('nationalsay th/male/goodnight'),
]

const execute: WithVoiceChannelCallback = async ({ connection, param, message }) => {
  if (param) {
    const params = param.split('/')
    const url = await getVoiceLineNational(params[0], params[1], params[2])
    await playSound(connection, url)
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = ({ param }) => {
  if (!param) return emptyParamError

  const params = param.split('/')
  if (params.length !== 3) {
    return invalidParamError
  }
}

const command: Command = {
  name: 'nationalsay',
  desc: 'My friend will say it. (my friend list: https://responsivevoice.org/text-to-speech-languages/)',
  param: CommandParamType.Required,
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command

import { WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin, Command } from './../types'
import { beep, exampleCommand } from '../utilities/string'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'

const emptyParamError = [
  beep('Please tell bubeep what to *sakod*.'),
  exampleCommand('sakod eiei'),
]

const execute: WithVoiceChannelCallback = async ({ connection, param }) => {
  if (param) {
    const word = param.split('').join(' ')
    connection.play(getVoiceLine(word))
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = ({ param }) => !param && emptyParamError

const command: Command = {
  name: 'sakod',
  desc: 'I sakod.',
  param: 2,
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command

import { WithVoiceChannelCallback, WithVoiceChannelCheckBeforeJoin, Command, CommandParamType } from './../types'
import { beep, exampleCommand } from '../utilities/string'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'
import { playSound } from '../helper/connection'

const emptyParamError = [
  beep('Please tell bubeep what to *sakod*.'),
  exampleCommand('sakod eiei'),
]

const execute: WithVoiceChannelCallback = async ({ param, message }) => {
  if (param) {
    const word = param.split('').join(' ')
    await playSound(message.guildId, getVoiceLine(word))
  }
}

const checkBeforeJoin: WithVoiceChannelCheckBeforeJoin = ({ param }) => !param ? emptyParamError : undefined

const command: Command = {
  name: 'sakod',
  desc: 'I sakod.',
  param: CommandParamType.Required,
  execute: withVoiceChannel(execute, { checkBeforeJoin }),
  withVoiceChannel: true,
}

export default command

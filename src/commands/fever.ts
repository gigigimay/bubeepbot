import { WithVoiceChannelCallback, Command, CommandParamType } from './../types'
import { getRandomInt } from '../utilities/number'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'
import { getAuthorNickname } from '../helper/message'
import { playSound } from '../helper/connection'

const execute: WithVoiceChannelCallback = async ({ connection, message }) => {
  const name = getAuthorNickname(message)
  const temperature = getRandomInt(390, 340) / 10
  if (name && temperature) {
    await playSound(message.guildId, [
      getVoiceLine(name),
      getVoiceLine('อุณหภูมิของท่านคือ'),
      getVoiceLine(temperature),
    ])
  }
}

const command: Command = {
  name: 'fever',
  desc: 'measuring your body temperature',
  param: CommandParamType.None,
  execute: withVoiceChannel(execute),
  withVoiceChannel: true,
}

export default command

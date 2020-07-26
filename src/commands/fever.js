import { getRandomInt } from '../utilities/number'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'
import { getAuthorNickname } from '../helper/message'
import { playSound } from '../helper/connection'

const execute = async ({ connection, message }) => {
  const name = getAuthorNickname(message)
  const temperature = getRandomInt(390, 340) / 10
  await playSound(connection, [
    getVoiceLine(name),
    getVoiceLine('อุณหภูมิของท่านคือ'),
    getVoiceLine(temperature),
  ])
}

export default {
  name: 'fever',
  desc: 'measuring your body temperature',
  param: 0, // 0: no param, 1: optional, 2: required
  execute: withVoiceChannel(execute),
  withVoiceChannel: true,
}

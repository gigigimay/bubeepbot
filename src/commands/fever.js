import { getRandomInt } from '../utilities/number'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel } from '../helper/execute'
import { getAuthorNickname } from '../helper/message'

const execute = ({ connection, message }) => {
  const name = getAuthorNickname(message)
  const dispatcher = connection.play(getVoiceLine(name))
  dispatcher.on('finish', () => {
    const dispatcher2 = connection.play(getVoiceLine('อุณหภูมิของท่านคือ'))
    dispatcher2.on('finish', () => {
      const temperature = getRandomInt(390, 340) / 10
      connection.play(getVoiceLine(temperature))
    })
  })
}

export default {
  name: 'fever',
  desc: 'measuring your body temperature',
  param: 0, // 0: no param, 1: optional, 2: required
  execute: withVoiceChannel(execute),
}

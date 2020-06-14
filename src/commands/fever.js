import { beep } from '../utilities/string'
import { getRandomInt } from '../utilities/number'
import { getVoiceLine } from '../helper/tts'

const errorNoConnection = [
  beep('You need to join voice channel'),
]

const execute = async ({ message }) => {
  if (!message.member.voice.channel) {
    return message.channel.send(errorNoConnection)
  }
  const connection = await message.member.voice.channel.join()
  const dispatcher = connection.play(getVoiceLine('ติ้ด'))
  dispatcher.on('finish', () => {
    const dispatcher2 = connection.play(getVoiceLine('อุณหภูมิของท่านคือ'))
    dispatcher2.on('finish', () => {
      const temperature = getVoiceLine(getRandomInt(390, 340) / 10)
      connection.play(temperature)
    })
  })
}

export default {
  name: 'fever',
  desc: 'measuring your body temperature',
  param: 0, // 0: no param, 1: optional, 2: required
  execute,
}

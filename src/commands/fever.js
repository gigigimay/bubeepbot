import { beep } from '../utilities/string'
import { getRandomInt } from '../utilities/number'

const VOICE_URL_START = 'https://translate.google.com.vn/translate_tts?ie=UTF-8&q='
const VOICE_URL_END = '&tl=th&client=tw-ob'

const getVoiceLine = word => `${VOICE_URL_START}${word}${VOICE_URL_END}`

const errorNoConnection = [
  beep('You need to join voice channel'),
]

const execute = async message => {
  if (!message.member.voice.channel) {
    message.channel.send(errorNoConnection)
  } else {
    const connection = await message.member.voice.channel.join()

    let dispatcher = connection.play(getVoiceLine('อุณหภูมิของท่านคือ'))
    dispatcher.on('finish', () => {
      dispatcher = connection.play(getVoiceLine(getRandomInt(390, 340) / 10))
    })
  }
}

export default {
  name: 'fever',
  desc: 'measuring your body temperature',
  param: 0, // 0: no param, 1: optional, 2: required
  execute,
}

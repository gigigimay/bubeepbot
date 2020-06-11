import { beep } from '../utilities/string'
import { getRandomInt } from '../utilities/number'

// site for get TextToSpeech
// https://soundoftext.com/#learn

const VOICE_URL = 'https://soundoftext.nyc3.digitaloceanspaces.com'
const VOICE_FILE_NAME = {
  yourTemp: '8a2999e0-ab35-11ea-a916-9d0df1ae6773.mp3',
  thirtySixDot: 'ae4e87e0-ab35-11ea-a916-9d0df1ae6773.mp3',
  1: 'd26f9740-cb46-11e7-a240-b9639a1828db.mp3',
  2: 'db4566b0-cb46-11e7-a240-b9639a1828db.mp3',
  3: 'e75fb2c0-cb46-11e7-a240-b9639a1828db.mp3',
  4: 'f00c7660-cb46-11e7-a240-b9639a1828db.mp3',
  5: 'f82d4db0-cb46-11e7-a240-b9639a1828db.mp3',
  6: '00c06ed0-cb46-11e7-a240-b9639a1828db.mp3',
  7: '06ef3a20-cb46-11e7-a240-b9639a1828db.mp3',
  8: '0be75a30-cb46-11e7-a240-b9639a1828db.mp3',
  9: '12758390-cb46-11e7-a240-b9639a1828db.mp3',
}
const getVoiceLine = name => `${VOICE_URL}/${VOICE_FILE_NAME[name]}`

const errorNoConnection = [
  beep('You need to join voice channel'),
]

const execute = async message => {
  if (!message.member.voice.channel) {
    message.channel.send(errorNoConnection)
  } else {
    const connection = await message.member.voice.channel.join()

    let dispatcher = connection.play(getVoiceLine('yourTemp'))
    dispatcher.on('finish', () => {
      dispatcher = connection.play(getVoiceLine('thirtySixDot'))
      dispatcher.on('finish', () => {
        const voiceLineNumberUrl = getVoiceLine(getRandomInt(9, 1))
        connection.play(voiceLineNumberUrl)
      })
    })
  }
}

export default {
  name: 'fever',
  desc: 'measuring your body temperature',
  param: 0, // 0: no param, 1: optional, 2: required
  execute,
}

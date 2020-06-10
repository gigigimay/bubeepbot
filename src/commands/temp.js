import { exampleCommand, beep } from '../utilities/string'
import { getRandomInt } from '../utilities/number'

// site for get TextToSpeech
// https://soundoftext.com/#learn

const voiceUrls = {
  yourTemp:
    'https://soundoftext.nyc3.digitaloceanspaces.com/8a2999e0-ab35-11ea-a916-9d0df1ae6773.mp3',
  thirtySixDot:
    'https://soundoftext.nyc3.digitaloceanspaces.com/ae4e87e0-ab35-11ea-a916-9d0df1ae6773.mp3',
}

const voiceNumberUrls = {
  1: 'd26f9740',
  2: 'db4566b0',
  3: 'e75fb2c0',
  4: 'f00c7660',
  5: 'f82d4db0',
  6: '00c06ed0',
  7: '06ef3a20',
  8: '0be75a30',
  9: '12758390',
}

const errorNoConnection = [
  beep('You need to join voice channel'),
]

const errorParam = [
  beep('You don\'need to tell bubeep much.'),
  exampleCommand('temp'),
]

const execute = async (message, param) => {
  if (param != null) {
    message.channel.send(errorParam)
  } else if (!message.member.voice.channel) {
    message.channel.send(errorNoConnection)
  } else {
    const connection = await message.member.voice.channel.join()

    let dispatcher = connection.play(voiceUrls.yourTemp)
    dispatcher.on('finish', () => {
      dispatcher = connection.play(voiceUrls.thirtySixDot)
      dispatcher.on('finish', () => {
        const voiceLineNumberUrl = `https://soundoftext.nyc3.digitaloceanspaces.com/${
          voiceNumberUrls[getRandomInt(9, 1)]
        }-cb46-11e7-a240-b9639a1828db.mp3`
        connection.play(voiceLineNumberUrl)
      })
    })
  }
}

export default {
  name: 'temp',
  desc: 'measuring your temperature',
  param: 0, // 0: no param, 1: optional, 2: required
  execute,
}

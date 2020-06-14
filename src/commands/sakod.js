import { beep, exampleCommand } from '../utilities/string'
import { getVoiceLine } from '../utilities/tts'

const errors = {
  noConnection: beep('You need to join a voice channel'),
  emptyParams: [
    beep('Please tell bubeep what to *say*.'),
    exampleCommand('echo hello'),
  ],
}

const execute = async (message, param) => {
  if (!param) {
    return message.channel.send(errors.emptyParams)
  }
  if (!message.member.voice.channel) {
    return message.channel.send(errors.noConnection)
  }
  const connection = await message.member.voice.channel.join()
  const splitted = param.split('').join(' ')
  const voice = getVoiceLine(splitted)
  connection.play(voice)
}

export default {
  name: 'sakod',
  desc: 'I sakod',
  param: 2, // 0: no param, 1: optional, 2: required
  execute,
}

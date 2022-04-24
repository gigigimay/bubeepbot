import { WithVoiceChannelCallback, Command, CommandParamType, InteractionWithVoiceChannelCallback } from './../types'
import { getRandomInt } from '../utilities/number'
import { getVoiceLine } from '../helper/tts'
import { withVoiceChannel, interactionWithVoiceChannel } from '../helper/execute'
import { getAuthorNickname } from '../helper/message'
import { getAuthorNickname as interactionGetAuthorNickname } from '../helper/interaction'
import { playSound } from '../helper/connection'

const getMessages = (name: string): string[] => {
  const temperature = getRandomInt(390, 340) / 10
  return [name, 'อุณหภูมิของท่านคือ', `${temperature}`]
}

const execute: WithVoiceChannelCallback = async ({ connection, message }) => {
  const name = getAuthorNickname(message)
  if (name) {
    const messages = getMessages(name)
    await playSound(connection, messages.map(getVoiceLine))
  }
}

const interactionExecute: InteractionWithVoiceChannelCallback = async ({ connection, interaction }) => {
  const name = interactionGetAuthorNickname(interaction)
  if (name) {
    const sentence = getMessages(name)
    interaction.reply(sentence.join(' '))
    await playSound(connection, sentence.map(getVoiceLine))
  }
}

const command: Command = {
  name: 'fever',
  desc: 'measuring your body temperature',
  param: CommandParamType.None,
  execute: withVoiceChannel(execute),
  interactionExecute: interactionWithVoiceChannel(interactionExecute),
  withVoiceChannel: true,
}

export default command

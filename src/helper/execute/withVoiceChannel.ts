import fp from 'lodash/fp'
import { Message } from 'discord.js'
import { VoiceConnection, joinVoiceChannel } from '@discordjs/voice'
import { beep, parseCommand } from '../../utilities/string'
import { getCommand } from '../command'
import { getVoiceChannel } from '../message'
import config from '../../config.json'
import { CommandExecutionWithVoiceChannel } from '../../types'

const defaultError = beep('You need to join a voice channel.')

const filter = (response: Message): boolean => {
  if (response.author.bot) return false
  const parsed = parseCommand(response.content)
  if (!parsed) return false
  const command = getCommand(parsed.name)
  if (!command) return false
  return !!command.withVoiceChannel
}

const tryToDisconnect = async (args: {
  message: Message
  connection: VoiceConnection
  time?: number
}): Promise<void> => {
  const { message, connection, time = config.voiceChannelTimeout } = args
  try {
    await message.channel.awaitMessages(
      {
        filter,
        max: 1,
        time: time * 1000,
        errors: ['time'],
      })
  } catch (e) {
    connection.disconnect()
  }
}

const withVoiceChannel: CommandExecutionWithVoiceChannel = (
  callback,
  options = {},
) => async ({ message, param }) => {
  const {
    noConnectionError = defaultError,
    checkBeforeJoin = () => undefined,
  } = options
  const voiceChannel = getVoiceChannel(message)
  if (!voiceChannel) {
    return message?.channel?.send(noConnectionError)
  }
  const error = await checkBeforeJoin({ message, param })
  if (!(fp.isNil(error) || fp.isEmpty(error))) {
    return message?.channel?.send(error.toString())
  }
  // TODO: continue fix voice here
  const channelId = message.member?.voice.channelId
  const guildId = message.guildId
  const adapterCreator = message.guild?.voiceAdapterCreator

  console.log(`connection: channel id >>> ${channelId}`)
  console.log(`connection: guild id >>> ${guildId}`)
  console.log(`connection: adapterCreator >>> ${adapterCreator}`)

  if (channelId && guildId && adapterCreator) {
    console.log('will join')
    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      adapterCreator: adapterCreator,
    })
    await callback({ message, param, connection })
    await tryToDisconnect({ message, connection })
  }
}

export default withVoiceChannel

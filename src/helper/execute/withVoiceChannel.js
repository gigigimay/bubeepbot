import fp from 'lodash/fp'
import { beep, parseCommand } from '../../utilities/string'
import { getCommand } from '../command'
import { getVoiceChannel } from '../message'
import config from '../../config.json'

const defaultError = beep('You need to join a voice channel.')

const filter = response => {
  if (response.author.bot) return
  const parsed = parseCommand(response.content)
  if (parsed) {
    const command = getCommand(parsed.name, response)
    return command && command.withVoiceChannel
  }
}

const tryToDisconnect = async ({ message, connection, time = config.voiceChannelTimeout }) => {
  try {
    await message.channel.awaitMessages(
      filter,
      { max: 1, time: time * 1000, errors: ['time'] },
    )
  } catch (e) {
    connection.disconnect()
  }
}

/**
 * @param {(args: { message, param: string, connection }) => void} callback
 * a function that runs after bot has joined user's voice channel
 * @param {{
 *  noConnectionError: string,
 *  checkBeforeJoin: (args: { message, param: string }) => boolean
 * }} options optional options
 *
 * ### available options
 * - `noConnectionError` - error message to reply when user is not in a voice channel.
 * - `checkBeforeJoin` - a callback function that execute before join.
 *    if the function returns false, command will end and bot will not join channel.
 */
const withVoiceChannel = (callback, options = {}) => async ({ message, param }) => {
  const {
    noConnectionError = defaultError,
    checkBeforeJoin = () => undefined,
  } = options
  const voiceChannel = getVoiceChannel(message)
  if (!voiceChannel) { return message.channel.send(noConnectionError) }
  const error = await checkBeforeJoin({ message, param })
  if (!(fp.isNil(error) || fp.isEmpty(error))) { return message.channel.send(error) }
  const connection = await voiceChannel.join()
  await callback({ message, param, connection })
  await tryToDisconnect({ message, connection })
}

export default withVoiceChannel

import fp from 'lodash/fp'
import { beep } from '../../utilities/string'
import { getVoiceChannel } from '../message'

const defaultError = beep('You need to join a voice channel.')

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
    checkBeforeJoin = () => { },
  } = options
  const voiceChannel = getVoiceChannel(message)
  if (!voiceChannel) { return message.channel.send(noConnectionError) }
  const error = await checkBeforeJoin({ message, param })
  if (!(fp.isNil(error) || fp.isEmpty(error))) { return message.channel.send(error) }
  const connection = await voiceChannel.join()
  callback({ message, param, connection })
}

export default withVoiceChannel

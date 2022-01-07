import fp from 'lodash/fp'
import { CommandInteraction, GuildMember, Message } from 'discord.js'
import { VoiceConnection, joinVoiceChannel, DiscordGatewayAdapterCreator } from '@discordjs/voice'
import { beep, parseCommand } from '../../utilities/string'
import { getCommand } from '../command'
import { getVoiceChannel } from '../message'
import config from '../../config'
import { CommandExecutionWithVoiceChannel, CommandInteractionExecutionWithVoiceChannel } from '../../types'
import { getVoiceChannel as getInteractionVoiceChannel } from '../interaction'

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
    console.log(`leaving voice channel after ${time} seconds idle time`)
    connection.disconnect()
  }
}
const interactionTryToDisconnect = async (args: {
  interaction: CommandInteraction
  connection: VoiceConnection
  time?: number
}): Promise<void> => {
  const { interaction, connection, time = config.voiceChannelTimeout } = args
  try {
    await interaction.channel?.awaitMessages(
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

  /** check if the user is not in a voice channel */
  const voiceChannel = getVoiceChannel(message)
  if (!voiceChannel) {
    return message?.channel?.send(noConnectionError)
  }

  /** checkBeforeJoin */
  const error = await checkBeforeJoin({ message, param })
  if (!(fp.isNil(error) || fp.isEmpty(error))) {
    return message?.channel?.send(error.toString())
  }

  const channelId = message.member?.voice.channelId
  const guildId = message.guildId
  const adapterCreator = message.guild?.voiceAdapterCreator

  if (channelId && guildId && adapterCreator) {
    /** join voice */
    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      // TODO: remove type casting when discordjs fixed this type issue
      adapterCreator: adapterCreator as DiscordGatewayAdapterCreator,
    })
    await callback({ message, param, connection })
    await tryToDisconnect({ message, connection })
  }
}

export const interactionWithVoiceChannel: CommandInteractionExecutionWithVoiceChannel = (
  callback,
  options = {},
) => async (interaction: CommandInteraction) => {
  const {
    noConnectionError = defaultError,
    checkBeforeJoin = () => undefined,
  } = options

  /** check if the user is not in a voice channel */
  const voiceChannel = getInteractionVoiceChannel(interaction)
  if (!voiceChannel) {
    return interaction.reply(noConnectionError)
  }

  /** checkBeforeJoin */
  const error = await checkBeforeJoin(interaction)
  if (!(fp.isNil(error) || fp.isEmpty(error))) {
    return interaction?.channel?.send(error.toString())
  }

  const channelId = (interaction.member as GuildMember).voice.channelId
  const guildId = interaction.guildId
  const adapterCreator = interaction.guild?.voiceAdapterCreator

  if (channelId && guildId && adapterCreator) {
    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      // TODO: remove type casting when discordjs fixed this type issue
      adapterCreator: adapterCreator as DiscordGatewayAdapterCreator,
    })
    await callback({ interaction, connection })
    await interactionTryToDisconnect({ interaction, connection })
  }
}

export default withVoiceChannel

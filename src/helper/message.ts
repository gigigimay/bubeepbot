import { Message, VoiceChannel, User, StageChannel } from 'discord.js'

export const getVoiceChannel = (message: Message): VoiceChannel | StageChannel | null | undefined => message.member?.voice.channel
export const getAuthorUsername = (message: Message): string => message.author.username
export const getAuthorNickname = (message: Message): string | null | undefined => message.member?.nickname

export interface CommandTarget {
  target: User | undefined
  aimed: boolean
  tagged: User | undefined
}

// TODO: use client user cache instead of mentions because mentions can be in wrong order
export const getCommandTarget = (message: Message, param = ''): CommandTarget => {
  const { author, mentions } = message
  const tagged = mentions.users.first()
  const target = tagged ?? author
  const aimed = !!param.match(/@/)
  return {
    target,
    aimed,
    tagged,
  }
}

export const sendError = (e: Error, message: Message, text = ''): Promise<Message> =>
  message.channel.send([
    text,
    '```',
    e.message,
    '```',
  ].join('\n'))

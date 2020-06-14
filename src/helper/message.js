import fp from 'lodash/fp'

export const getVoiceChannel = fp.get('member.voice.channel')

// TODO: use client user cache instead of mentions because mentions can be in wrong order
export const getCommandTarget = (message, param = '') => {
  const { author, mentions } = message
  const tagged = mentions.users.first()
  const target = tagged || author
  const aimed = param.match(/@/)
  return {
    target,
    aimed,
    tagged,
  }
}

export const sendError = (e, message, text = '') => {
  message.channel.send([
    text,
    '```',
    e.message,
    '```',
  ])
}

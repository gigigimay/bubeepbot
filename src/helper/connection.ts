import fp from 'lodash/fp'
import { VoiceConnection } from 'discord.js'
import { asyncForEach } from '../utilities/array'

export const playSound = (connection: VoiceConnection, sound: string): Promise<void> => new Promise(resolve => {
  if (fp.isNil(sound) || fp.isEmpty(sound)) resolve()
  if (typeof sound === 'string') {
    const dispatcher = connection.play(sound)
    dispatcher.on('finish', resolve)
  } else if (Array.isArray(sound)) {
    Promise.resolve(asyncForEach<string>(sound, s => playSound(connection, s)))
      .then(resolve)
  }
})

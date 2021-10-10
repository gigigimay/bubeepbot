import fp from 'lodash/fp'
import { VoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice'
import { asyncForEach } from '../utilities/array'

export const playSound = (connection: VoiceConnection, sound: string | string[]): Promise<void> => new Promise((resolve) => {
  if (fp.isNil(sound) || fp.isEmpty(sound)) resolve()
  if (typeof sound === 'string') {
    const player = createAudioPlayer()
    const resource = createAudioResource(sound)
    player.play(resource)
    player.on(AudioPlayerStatus.AutoPaused, () => {
      resolve()
    })
    resolve() // TODO: strange code here 👀
  } else if (Array.isArray(sound)) {
    Promise.resolve(asyncForEach<string>(sound, (s) => playSound(connection, s)))
      .then(resolve)
  }
})
